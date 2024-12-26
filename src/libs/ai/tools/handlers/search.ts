import { PerplexityClient } from "../../../api/perplexity";
import type { ToolHandler, ToolResponse } from "../types";
import { ToolError } from "../types";

export class SearchToolHandler implements ToolHandler {
  private client: PerplexityClient;

  constructor(apiKey?: string) {
    this.client = new PerplexityClient(apiKey);
  }

  async execute(params: Record<string, unknown>): Promise<ToolResponse> {
    try {
      if (!this.validate(params)) {
        throw new ToolError("Invalid search parameters", "search");
      }

      const query = params.query as string;
      const response = await this.client.createChatCompletion({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful search assistant. Provide concise and accurate information.",
          },
          {
            role: "user",
            content: query,
          },
        ],
      });

      return {
        type: "search",
        content: response.choices[0].message.content,
        metadata: {
          usage: response.usage,
          model: response.model,
        },
      };
    } catch (error) {
      throw new ToolError(`Search failed: ${error.message}`, "search", error);
    }
  }

  validate(params: Record<string, unknown>): boolean {
    return typeof params.query === "string" && params.query.length > 0;
  }
}
