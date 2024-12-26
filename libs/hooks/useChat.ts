"use client";

import { useState, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import type {
  ChatMessage,
  ChatState,
  SendMessageParams,
  LoadMessagesParams,
  ToolCall,
  AIResponse,
  ChatError,
  ChatMessageMetadata,
} from "@/types/chat";

const useChat = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
    hasMore: true,
  });

  const handleToolCall = useCallback(
    async (toolCall: ToolCall): Promise<void> => {
      try {
        switch (toolCall.type) {
          case "search":
            // Implement search_via_perplexity
            break;
          case "web_read":
            // Implement read_web_page_content
            break;
          case "image_generation":
            // Implement image_generation_via_dalle_3
            break;
          default:
            throw new Error(`Unsupported tool type: ${toolCall.type}`);
        }
      } catch (error) {
        toolCall.status = "error";
        toolCall.error =
          error instanceof Error ? error.message : "Unknown error";
      }
    },
    []
  );

  const processAIResponse = useCallback(
    async (message: ChatMessage): Promise<void> => {
      const aiResponse: AIResponse = {
        messageId: message.id,
        content: "",
        status: "thinking",
      };

      try {
        // Update message with initial AI response
        setState((prevState: ChatState) => ({
          ...prevState,
          messages: prevState.messages.map((msg: ChatMessage) =>
            msg.id === message.id ? { ...msg, metadata: { aiResponse } } : msg
          ),
        }));

        // Process tool calls if needed
        const toolCalls = message.metadata?.toolCalls;
        if (toolCalls) {
          aiResponse.status = "tool_calling";
          aiResponse.toolCalls = toolCalls;

          // Update UI with tool calling status
          setState((prevState: ChatState) => ({
            ...prevState,
            messages: prevState.messages.map((msg: ChatMessage) =>
              msg.id === message.id ? { ...msg, metadata: { aiResponse } } : msg
            ),
          }));

          // Process each tool call
          await Promise.all(toolCalls.map(handleToolCall));
        }

        // Final response processing
        aiResponse.status = "completed";
        setState((prevState: ChatState) => ({
          ...prevState,
          messages: prevState.messages.map((msg: ChatMessage) =>
            msg.id === message.id ? { ...msg, metadata: { aiResponse } } : msg
          ),
        }));
      } catch (error) {
        const chatError: ChatError = {
          code: "AI_RESPONSE_ERROR",
          message: error instanceof Error ? error.message : "Unknown error",
        };

        aiResponse.status = "error";
        setState((prevState: ChatState) => ({
          ...prevState,
          messages: prevState.messages.map((msg: ChatMessage) =>
            msg.id === message.id
              ? { ...msg, metadata: { aiResponse, error: chatError } }
              : msg
          ),
        }));
      }
    },
    [handleToolCall]
  );

  const sendMessage = useCallback(
    async ({
      content,
      threadId,
      metadata,
    }: SendMessageParams): Promise<void> => {
      setState((prevState: ChatState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      try {
        const newMessage: ChatMessage = {
          id: uuidv4(),
          thread_id: threadId,
          content,
          role: "user",
          created_at: new Date().toISOString(),
          metadata: metadata as ChatMessageMetadata,
        };

        // Add user message
        setState((prevState: ChatState) => ({
          ...prevState,
          messages: [...prevState.messages, newMessage],
        }));

        // Process AI response
        await processAIResponse(newMessage);
      } catch (error) {
        setState((prevState: ChatState) => ({
          ...prevState,
          error: {
            code: "SEND_MESSAGE_ERROR",
            message:
              error instanceof Error ? error.message : "Failed to send message",
          },
        }));
      } finally {
        setState((prevState: ChatState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    },
    [processAIResponse]
  );

  const loadMessages = useCallback(
    async ({
      threadId,
      limit = 50,
      before,
    }: LoadMessagesParams): Promise<void> => {
      setState((prevState: ChatState) => ({
        ...prevState,
        isLoading: true,
        error: null,
      }));

      try {
        // Implement message loading from Supabase
        // Update state with loaded messages
      } catch (error) {
        setState((prevState: ChatState) => ({
          ...prevState,
          error: {
            code: "LOAD_MESSAGES_ERROR",
            message:
              error instanceof Error
                ? error.message
                : "Failed to load messages",
          },
        }));
      } finally {
        setState((prevState: ChatState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    },
    []
  );

  return {
    ...state,
    sendMessage,
    loadMessages,
  };
};

export default useChat;
