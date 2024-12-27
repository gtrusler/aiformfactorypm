import { getBaseUrl } from "../../lib/utils";
import { createClient } from "@supabase/supabase-js";

export interface AnthropicConfig {
  apiKey?: string;
  model?: string;
  supabase?: any;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface MessageResponse {
  id: string;
  content: string | { type: string; text: string };
  model: string;
  role: "assistant";
  type: "message";
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

interface EmbeddingResponse {
  embedding: number[];
  usage: {
    input_tokens: number;
  };
}

export class AnthropicClient {
  private baseUrl: string;
  private defaultModel: string;
  private supabase: any;

  constructor(config?: AnthropicConfig) {
    this.baseUrl = "/api/anthropic";
    this.defaultModel = "claude-3-sonnet-20240229";
    this.supabase = config?.supabase;
  }

  async createMessage(params: {
    messages: Message[];
    system?: string;
    model?: string;
    threadId?: string;
    includeContext?: boolean;
  }): Promise<MessageResponse> {
    try {
      let context = [];

      // If context is requested and we have Supabase configured
      if (
        params.includeContext &&
        this.supabase &&
        params.messages.length > 0
      ) {
        const lastMessage = params.messages[params.messages.length - 1];
        const embedding = await this.createEmbedding(lastMessage.content);

        const { data: relevantContext } = await this.supabase.rpc(
          "match_documents",
          {
            query_embedding: embedding,
            match_threshold: 0.8,
            match_count: 5,
          }
        );

        context = relevantContext?.map((doc: any) => doc.content) || [];
      }

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          messages: params.messages,
          system: `You are a helpful AI assistant. You have access to the entire conversation history in the messages array. Each message contains the complete text of what was said.

When asked about previous conversations, you should:
1. Look through all messages in the messages array
2. Pay attention to both user and assistant messages
3. Reference specific parts of previous conversations when answering questions
4. If you find relevant previous conversations, summarize what was discussed
5. If you don't find any relevant previous conversations, clearly state that you don't see any discussions about the topic in the messages

Important: The messages array contains the COMPLETE conversation history. You do not need to look elsewhere for context.`,
          model: params.model || this.defaultModel,
          context,
          threadId: params.threadId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API request failed");
      }

      const messageResponse = await response.json();
      return messageResponse;
    } catch (error) {
      console.error("Error in createMessage:", error);
      throw error;
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.baseUrl}/embed`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Embedding request failed");
      }

      const data: EmbeddingResponse = await response.json();
      return data.embedding;
    } catch (error) {
      console.error("Embedding creation error:", error);
      throw error;
    }
  }

  async addToKnowledgeBase(
    content: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    if (!this.supabase) {
      throw new Error("Supabase client not configured");
    }

    const embedding = await this.createEmbedding(content);

    const { error } = await this.supabase.from("ai_knowledge_vectors").insert([
      {
        content,
        embedding,
        metadata,
      },
    ]);

    if (error) throw error;
  }

  private async saveToChatHistory(
    message: MessageResponse,
    threadId: string
  ): Promise<void> {
    if (!this.supabase) return;

    const chatMessage = {
      thread_id: threadId,
      speaker_id: "assistant",
      message:
        typeof message.content === "string"
          ? message.content
          : message.content.text,
      metadata: {
        model: message.model,
        usage: message.usage,
      },
    };

    const { error } = await this.supabase
      .from("chat_histories")
      .insert([chatMessage]);

    if (error) throw error;
  }
}
