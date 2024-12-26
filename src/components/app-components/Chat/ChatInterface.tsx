"use client";

import React, { useState, useRef, useEffect } from "react";
import type {
  AIResponse,
  Message,
  ToolResponse,
  ToolType,
  ToolStatus,
  MessageMetadata,
} from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/base/Spinner";
import { MessageBubble } from "./MessageBubble";
import { ToolExecutionStatus } from "./ToolExecutionStatus";
import { Plus, File, Image, X } from "lucide-react";

interface FileAttachment {
  type: "image" | "text";
  content: string;
  name: string;
}

// Extend MessageMetadata to include attachments
declare module "@/types/chat" {
  interface MessageMetadata {
    attachments?: FileAttachment[];
  }
}

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
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const files = e.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = [];

    for (const file of Array.from(files)) {
      try {
        if (file.type.startsWith("image/")) {
          const base64 = await fileToBase64(file);
          newAttachments.push({
            type: "image",
            content: base64,
            name: file.name,
          });
        } else if (file.type === "text/plain") {
          const text = await file.text();
          newAttachments.push({
            type: "text",
            content: text,
            name: file.name,
          });
        }
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
      }
    }

    setAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeAttachment = (index: number): void => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
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
    if ((!trimmedInput && attachments.length === 0) || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: trimmedInput,
      metadata: attachments.length > 0 ? { attachments } : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setAttachments([]);
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
        {messages.map((message, index) => {
          const metadata = message.metadata ?? {};
          const toolStatus = metadata.toolStatus as ToolStatus | undefined;
          const toolType = metadata.toolType as ToolType | undefined;
          const attachments = metadata.attachments as
            | FileAttachment[]
            | undefined;

          return (
            <div key={index} className="flex flex-col">
              <MessageBubble message={message} />
              {attachments?.map((attachment, attachmentIndex) => (
                <div key={attachmentIndex} className="mt-2">
                  {attachment.type === "image" ? (
                    <img
                      src={attachment.content}
                      alt={attachment.name}
                      className="max-w-xs rounded-md"
                    />
                  ) : (
                    <div className="bg-gray-100 p-2 rounded-md">
                      <p className="font-mono text-sm">{attachment.name}</p>
                      <p className="mt-1 text-sm">
                        {String(attachment.content)}
                      </p>
                    </div>
                  )}
                </div>
              ))}
              {toolStatus && toolType && (
                <ToolExecutionStatus status={toolStatus} toolType={toolType} />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
        {attachments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-1 bg-gray-100 p-1 rounded"
              >
                {file.type === "image" ? (
                  <Image className="w-4 h-4" />
                ) : (
                  <File className="w-4 h-4" />
                )}
                <span className="text-sm">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center space-x-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            accept="image/*,.txt"
            className="hidden"
            multiple
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "p-2 rounded-md transition-colors",
              "bg-gray-100 text-gray-700",
              "hover:bg-gray-200",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
              "disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            <Plus className="w-5 h-5" />
          </button>

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
            disabled={
              isLoading || (!inputValue.trim() && attachments.length === 0)
            }
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
