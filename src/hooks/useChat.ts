import { useState, useCallback } from "react";
import type { Message, AIResponse } from "@/types/chat";
import { AIMessageHandler } from "@/libs/ai/messageHandler";
import type { ToolType } from "@/libs/ai/tools/types";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

// Tool handlers
const toolHandlers: {
  [key in ToolType]: {
    handler: (
      params: Record<string, unknown>
    ) => Promise<{ content: string | string[] }>;
    validateParams: (params: Record<string, unknown>) => boolean;
  };
} = {
  search: {
    handler: async (params: Record<string, unknown>) => {
      const query = params.query as string;
      return { content: `Search results for: ${query}` };
    },
    validateParams: (params: Record<string, unknown>) => {
      return typeof params.query === "string" && params.query.length > 0;
    },
  },
  image: {
    handler: async (params: Record<string, unknown>) => {
      const prompt = params.prompt as string;
      return { content: [`Generated image for: ${prompt}`] };
    },
    validateParams: (params: Record<string, unknown>) => {
      return typeof params.prompt === "string" && params.prompt.length > 0;
    },
  },
  webpage: {
    handler: async (params: Record<string, unknown>) => {
      const url = params.url as string;
      return { content: `Content from webpage: ${url}` };
    },
    validateParams: (params: Record<string, unknown>) => {
      return typeof params.url === "string" && params.url.startsWith("http");
    },
  },
};

const messageHandler = new AIMessageHandler({
  availableTools: toolHandlers,
});

export function useChat() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const supabase = createClientComponentClient();

  const saveMessage = useCallback(
    async (
      threadId: string,
      speakerId: string,
      content: string,
      metadata: Record<string, unknown> = {}
    ) => {
      try {
        console.log("Saving message:", { threadId, speakerId, content });
        const { data, error } = await supabase
          .from("chat_histories")
          .insert([
            {
              thread_id: threadId,
              speaker_id: speakerId,
              message: content,
              metadata,
            },
          ])
          .select();

        if (error) {
          console.error("Failed to save message:", error);
          throw error;
        }

        console.log("Message saved successfully:", data);
        return data;
      } catch (err) {
        console.error("Error saving message:", err);
        throw err;
      }
    },
    [supabase]
  );

  const sendMessage = useCallback(
    async (message: Message): Promise<AIResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        // Generate thread ID if not provided
        const threadId = message.metadata?.threadId || crypto.randomUUID();

        // Save user message
        await saveMessage(threadId, "user", message.content, message.metadata);

        // Process message with AI
        const response = await messageHandler.processMessage(
          message.content,
          threadId
        );

        // Save AI response
        await saveMessage(threadId, "PM", response.content, response.metadata);

        // Return response with PM role
        return {
          ...response,
          role: "PM" as const,
        };
      } catch (err) {
        const error =
          err instanceof Error ? err : new Error("Failed to process message");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [saveMessage, setError, setIsLoading]
  );

  return {
    isLoading,
    error,
    sendMessage,
  };
}
