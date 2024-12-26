import { describe, it, expect, beforeAll } from "vitest";
import { VectorStore } from "@/libs/ai/vectorStore";

describe("VectorStore", () => {
  let vectorStore: VectorStore;

  beforeAll(() => {
    vectorStore = new VectorStore();
  });

  describe("getQueryEmbedding", () => {
    it("should generate embeddings for a query", async () => {
      const query = "Test query for embedding generation";
      const embedding = await vectorStore.getQueryEmbedding(query);

      expect(Array.isArray(embedding)).toBe(true);
      expect(embedding).toHaveLength(1536); // OpenAI ada-002 embedding size
      expect(embedding.every((n) => typeof n === "number")).toBe(true);
    });
  });

  describe("findRelevantContext", () => {
    it("should find relevant context with default options", async () => {
      const query = "Test query for context retrieval";
      const results = await vectorStore.findRelevantContext(query);

      expect(Array.isArray(results)).toBe(true);
      if (results.length > 0) {
        expect(results[0]).toHaveProperty("id");
        expect(results[0]).toHaveProperty("content");
        expect(results[0]).toHaveProperty("metadata");
        expect(results[0]).toHaveProperty("similarity");
        expect(results[0].similarity).toBeGreaterThanOrEqual(0.7);
      }
    });

    it("should respect custom threshold and limit", async () => {
      const query = "Test query for context retrieval";
      const options = { threshold: 0.5, limit: 2 };
      const results = await vectorStore.findRelevantContext(query, options);

      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeLessThanOrEqual(options.limit);
      if (results.length > 0) {
        expect(results[0].similarity).toBeGreaterThanOrEqual(options.threshold);
      }
    });
  });

  describe("addDocument", () => {
    it("should add a document with metadata", async () => {
      const content = "Test document content";
      const metadata = { source: "test", category: "unit-test" };

      await expect(
        vectorStore.addDocument(content, metadata)
      ).resolves.not.toThrow();
    });
  });
});
