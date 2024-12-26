import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";
import type { Database } from "@/types/supabase";

export interface VectorSearchResult {
  id: number;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

export class VectorStore {
  private supabase;
  private openai;

  constructor() {
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      throw new Error("Supabase credentials are required");
    }

    this.supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async getQueryEmbedding(query: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: query.replace(/\n/g, " "), // Normalize text
      });

      return response.data[0].embedding;
    } catch (error) {
      console.error("Error generating embedding:", error);
      throw new Error("Failed to generate embedding");
    }
  }

  async findRelevantContext(
    query: string,
    options = { threshold: 0.7, limit: 5 }
  ): Promise<VectorSearchResult[]> {
    try {
      const embedding = await this.getQueryEmbedding(query);

      const { data: documents, error } = await this.supabase.rpc(
        "match_documents",
        {
          query_embedding: embedding,
          match_threshold: options.threshold,
          match_count: options.limit,
        }
      );

      if (error) {
        console.error("Vector search error:", error);
        return [];
      }

      return documents || [];
    } catch (error) {
      console.error("Error finding relevant context:", error);
      return [];
    }
  }

  async addDocument(
    content: string,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    try {
      const embedding = await this.getQueryEmbedding(content);

      const { error } = await this.supabase
        .from("ai_knowledge_vectors")
        .insert({
          content,
          embedding,
          metadata,
        });

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error("Error adding document:", error);
      throw new Error("Failed to add document to vector store");
    }
  }
}
