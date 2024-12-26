import { describe, it, expect, vi, beforeEach } from "vitest";
import { AIMessageHandler } from "@/libs/ai/messageHandler";

// Mock fetch for vector API calls
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock the API clients
vi.mock("@/libs/api", () => ({
  PerplexityClient: vi.fn().mockImplementation(() => ({
    createMessage: vi.fn(),
  })),
  AnthropicClient: vi.fn().mockImplementation(() => ({
    createMessage: vi.fn().mockResolvedValue({
      content: { text: "Test response" },
    }),
  })),
}));

describe("AIMessageHandler with Vector Store", () => {
  let messageHandler: AIMessageHandler;

  beforeEach(() => {
    messageHandler = new AIMessageHandler({
      anthropicApiKey: "test-key",
    });

    // Reset fetch mock
    mockFetch.mockReset();

    // Default successful response
    mockFetch.mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          results: [
            {
              id: 1,
              content: "Test context content",
              metadata: { source: "test-doc" },
              similarity: 0.85,
            },
          ],
        }),
    });
  });

  it("should process message with context enhancement", async () => {
    const message = "Test user message";
    const response = await messageHandler.processMessage(message);

    expect(response).toBeDefined();
    expect(response.content).toBe("Test response");
    expect(response.status).toBe("completed");

    // Verify API was called
    expect(mockFetch).toHaveBeenCalledWith("/api/vector", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: message }),
    });
  });

  it("should handle vector API errors gracefully", async () => {
    // Mock API error
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    const message = "Test user message";
    const response = await messageHandler.processMessage(message);

    expect(response).toBeDefined();
    expect(response.content).toBe("Test response");
    expect(response.status).toBe("completed");
  });

  it("should handle empty context results", async () => {
    // Mock empty results
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: [] }),
    });

    const message = "Test user message";
    const response = await messageHandler.processMessage(message);

    expect(response).toBeDefined();
    expect(response.content).toBe("Test response");
    expect(response.status).toBe("completed");
  });
});
