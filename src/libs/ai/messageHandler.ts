import type { AIResponse, Message as ChatMessage } from "../../types/chat";
import { PerplexityClient, AnthropicClient } from "../api";
import type { Message as AnthropicMessage } from "../api/anthropic";
import type { VectorSearchResult } from "./vectorStore";
import { supabase } from "../../lib/supabase";

export interface AIMessageHandlerConfig {
  perplexityApiKey?: string;
  anthropicApiKey?: string;
  availableTools?: Record<string, unknown>;
}

export class AIMessageHandler {
  private perplexityClient: PerplexityClient;
  private anthropicClient: AnthropicClient;
  private systemPrompt: string;

  constructor(config: AIMessageHandlerConfig) {
    this.perplexityClient = new PerplexityClient({
      apiKey: config.perplexityApiKey,
    });
    this.anthropicClient = new AnthropicClient({
      apiKey: config.anthropicApiKey,
      model: "claude-3-sonnet-20240229",
    });
    this.systemPrompt = `You are a helpful AI assistant. You have access to the entire conversation history in the messages array. Each message contains the complete text of what was said.

When asked about previous conversations, you should:
1. Look through all messages in the messages array
2. Pay attention to both user and assistant messages
3. Reference specific parts of previous conversations when answering questions
4. If you find relevant previous conversations, summarize what was discussed
5. If you don't find any relevant previous conversations, clearly state that you don't see any discussions about the topic in the messages

Important: The messages array contains the COMPLETE conversation history. You do not need to look elsewhere for context.`;
  }

  private async getRelevantContext(message: string): Promise<string> {
    try {
      const response = await fetch("/api/vector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch context");
      }

      const { results } = (await response.json()) as {
        results: VectorSearchResult[];
      };

      if (!results?.length) return "";

      // Format context for the AI
      const context = results
        .map(
          (doc) =>
            `Context from ${doc.metadata.source || "document"}:\n${doc.content}`
        )
        .join("\n\n");

      return `\nRelevant context for your reference:\n${context}\n`;
    } catch (error) {
      console.error("Error retrieving context:", error);
      return "";
    }
  }

  private async getChatHistory(threadId?: string): Promise<string> {
    try {
      // Query without thread_id filter to get all history
      const { data, error } = await supabase
        .from("chat_histories")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50); // Limit to most recent 50 messages to avoid context length issues

      if (error) {
        console.error("Error retrieving chat history:", error);
        return "";
      }

      if (!data?.length) return "";

      // Format chat history for the AI
      const history = data
        .map((msg) => {
          // Map speaker_id to role
          const role =
            msg.speaker_id === "assistant" || msg.speaker_id === "PM"
              ? "assistant"
              : "user";
          return `<message role="${role}">${msg.message}</message>`;
        })
        .join("\n");

      return `\nPrevious conversation history:\n${history}\n`;
    } catch (error) {
      console.error("Error retrieving chat history:", error);
      return "";
    }
  }

  async processMessage(
    message: string,
    threadId?: string
  ): Promise<AIResponse> {
    try {
      // Get relevant context from vector store
      const context = await this.getRelevantContext(message);

      // Get chat history
      const chatHistory = await this.getChatHistory();

      // Format messages for Claude
      const messages: AnthropicMessage[] = [];

      // Add context as a system message if available
      if (context) {
        messages.push({
          role: "user",
          content: `Context from previous discussions:\n${context}\n\nPlease consider this context when responding to: ${message}`,
        });
      }

      // Parse chat history XML-like format and add messages
      if (chatHistory) {
        const historyMatches = Array.from(
          chatHistory.matchAll(
            /<message role="(user|assistant)">(.*?)<\/message>/g
          )
        );
        for (const match of historyMatches) {
          const [_, role, content] = match;
          messages.push({
            role: role as "user" | "assistant",
            content,
          });
        }
      }

      // Add the current message
      messages.push({
        role: "user",
        content: message,
      });

      const aiResponse = await this.anthropicClient.createMessage({
        messages,
        system: this.systemPrompt,
        model: "claude-3-sonnet-20240229",
      });

      return {
        messageId: crypto.randomUUID(),
        content:
          typeof aiResponse.content === "string"
            ? aiResponse.content
            : aiResponse.content.text || "Error processing response",
        status: "completed",
      };
    } catch (error) {
      console.error("Error in processMessage:", error);
      throw error;
    }
  }
}
