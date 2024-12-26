import { describe, it, expect, beforeEach } from "vitest";
import { createClient } from "@supabase/supabase-js";
import type { Message } from "@/types/chat";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

describe("Supabase Integration Tests", () => {
  const testThreadId = `test-${Date.now()}`;

  // Chat History Tests
  describe("Chat History", () => {
    it("should save a new message", async () => {
      const message = {
        thread_id: testThreadId,
        speaker_id: "user",
        message: "Test message",
        metadata: { test: true },
      };

      const { data, error } = await supabase
        .from("chat_histories")
        .insert([message])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject({
        thread_id: testThreadId,
        message: "Test message",
      });
    });

    it("should retrieve messages by thread", async () => {
      const { data, error } = await supabase
        .from("chat_histories")
        .select("*")
        .eq("thread_id", testThreadId)
        .order("created_at", { ascending: true });

      expect(error).toBeNull();
      expect(data).toBeInstanceOf(Array);
      expect(data?.length).toBeGreaterThan(0);
    });
  });

  // Vector Store Tests
  describe("Vector Store", () => {
    it("should store content with embeddings", async () => {
      const testContent = {
        content: "Test vector content",
        embedding: Array(1536).fill(0), // Example embedding
        metadata: { source: "test" },
      };

      const { data, error } = await supabase
        .from("ai_knowledge_vectors")
        .insert([testContent])
        .select()
        .single();

      expect(error).toBeNull();
      expect(data).toMatchObject({
        content: "Test vector content",
      });
    });

    it("should perform similarity search", async () => {
      const { data, error } = await supabase.rpc("match_documents", {
        query_embedding: Array(1536).fill(0),
        match_threshold: 0.5,
        match_count: 5,
      });

      expect(error).toBeNull();
      expect(data).toBeInstanceOf(Array);
    });
  });

  // Real-time Subscription Test
  describe("Real-time Updates", () => {
    it("should receive real-time updates", (done: () => void) => {
      const channel = supabase
        .channel(`chat:${testThreadId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_histories",
            filter: `thread_id=eq.${testThreadId}`,
          },
          (payload) => {
            expect(payload.new).toHaveProperty("thread_id", testThreadId);
            channel.unsubscribe();
            done();
          }
        )
        .subscribe();

      // Insert a test message to trigger the subscription
      supabase.from("chat_histories").insert([
        {
          thread_id: testThreadId,
          speaker_id: "user",
          message: "Realtime test message",
        },
      ]);
    });
  });

  // Cleanup
  describe("Cleanup", () => {
    it("should cleanup test data", async () => {
      const { error: chatError } = await supabase
        .from("chat_histories")
        .delete()
        .eq("thread_id", testThreadId);

      expect(chatError).toBeNull();

      const { error: vectorError } = await supabase
        .from("ai_knowledge_vectors")
        .delete()
        .eq("metadata->>source", "test");

      expect(vectorError).toBeNull();
    });
  });
});
