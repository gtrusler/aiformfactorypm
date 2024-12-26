import { useState } from "react";
import type { Message, AIResponse, ChatContextType } from "@/types/chat";

const simulateAIResponse = (message: Message): AIResponse => {
  // Simulate processing delay
  const content = message.content.toLowerCase();

  if (content.includes("search") || content.includes("find")) {
    return {
      content: "Let me search for that information.",
      metadata: {
        toolCalls: [
          {
            tool: "code_search",
            status: "pending",
            result: { query: message.content },
          },
        ],
      },
    };
  }

  if (content.includes("file") || content.includes("read")) {
    return {
      content: "I will read that file for you.",
      metadata: {
        toolCalls: [
          {
            tool: "file_read",
            status: "pending",
            result: { path: "example/path.txt" },
          },
        ],
      },
    };
  }

  if (content.includes("run") || content.includes("execute")) {
    return {
      content: "I will execute that command.",
      metadata: {
        toolCalls: [
          {
            tool: "terminal_command",
            status: "pending",
            result: { command: 'echo "Hello World"' },
          },
        ],
      },
    };
  }

  // Default response for general messages
  return {
    content: `I received your message: "${message.content}". How can I help you further?`,
  };
};

export function useChat(): ChatContextType {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (message: Message): Promise<AIResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Randomly simulate errors for testing (10% chance)
      if (Math.random() < 0.1) {
        throw new Error("Simulated network error");
      }

      const response = simulateAIResponse(message);
      return response;
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to send message");
      setError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
  };
}
