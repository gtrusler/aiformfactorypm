"use client";

import React, { useState, useRef, useEffect } from "react";
import type {
  AIResponse,
  Message,
  ToolResponse,
  ToolType,
  ToolStatus,
} from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/base/Spinner";
import { MessageBubble } from "./MessageBubble";
import { ToolExecutionStatus } from "./ToolExecutionStatus";

export interface ChatInterfaceProps {
  className?: string;
  initialMessages?: Message[];
  onMessageSent?: (message: Message) => Promise<void> | void;
  onToolExecution?: (tool: ToolType, result: unknown) => Promise<unknown>;
}

export function ChatInterface({
  className,
  initialMessages = [],
  onMessageSent,
  onToolExecution,
}: ChatInterfaceProps): React.JSX.Element {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { sendMessage } = useChat();

  const scrollToBottom = (): void => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleToolExecution = async (
    toolCalls: NonNullable<AIResponse["metadata"]>["toolCalls"]
  ): Promise<void> => {
    if (!toolCalls?.length) return;

    // Type guard for ToolType
    const isValidToolType = (tool: unknown): tool is ToolType => {
      const validTools: ToolType[] = [
        "code_search",
        "file_read",
        "terminal_command",
        "file_edit",
        "directory_list",
        "text_search",
        "file_search",
        "file_delete",
      ];
      return typeof tool === "string" && validTools.includes(tool as ToolType);
    };

    for (const toolCall of toolCalls) {
      if (!isValidToolType(toolCall.tool)) continue;

      try {
        const tool = toolCall.tool;
        setMessages((prev) => [
          ...prev,
          {
            role: "system",
            content: `Executing ${tool}...`,
            metadata: {
              toolStatus: "pending" as const,
              toolType: tool,
            },
          },
        ]);

        const result = await onToolExecution?.(tool, toolCall.result);

        setMessages((prev) => [
          ...prev.filter(
            (msg) =>
              msg.metadata?.toolType !== tool ||
              msg.metadata?.toolStatus !== "pending"
          ),
          {
            role: "system",
            content: `${tool} execution complete`,
            metadata: {
              toolStatus: "complete" as const,
              toolType: tool,
              result,
            },
          },
        ]);
      } catch (error) {
        const tool = toolCall.tool;
        setMessages((prev) => [
          ...prev.filter(
            (msg) =>
              msg.metadata?.toolType !== tool ||
              msg.metadata?.toolStatus !== "pending"
          ),
          {
            role: "system",
            content: `Error executing ${tool}: ${
              error instanceof Error ? error.message : "Unknown error"
            }`,
            metadata: {
              toolStatus: "error" as const,
              toolType: tool,
            },
          },
        ]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const trimmedInput = inputValue.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await sendMessage(userMessage);

      if (response.metadata?.toolCalls) {
        await handleToolExecution(response.metadata.toolCalls);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: response.content,
          metadata: response.metadata,
        },
      ]);

      await onMessageSent?.(userMessage);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: `Error: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
          metadata: { error: true },
        },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div key={index} className="flex flex-col">
            <MessageBubble message={message} />
            {message.metadata?.toolStatus && message.metadata.toolType && (
              <ToolExecutionStatus
                status={message.metadata.toolStatus}
                toolType={message.metadata.toolType}
              />
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        <div className="flex items-center space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit(e);
              }
            }}
            placeholder="Type your message..."
            className={cn(
              "flex-1 p-2 border rounded-md",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:opacity-50 disabled:bg-gray-50"
            )}
            disabled={isLoading}
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className={cn(
              "px-4 py-2 rounded-md transition-colors",
              "bg-blue-500 text-white",
              "hover:bg-blue-600",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            {isLoading ? <Spinner size="sm" /> : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
