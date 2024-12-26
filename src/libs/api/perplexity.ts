import { getBaseUrl } from "../../lib/utils";

export interface PerplexityConfig {
  apiKey?: string;
  model?: string;
  baseUrl?: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatResponse {
  id: string;
  choices: Array<{
    message: {
      role: "assistant";
      content: string;
    };
  }>;
}

export class PerplexityClient {
  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly defaultModel: string;

  constructor(config: PerplexityConfig = {}) {
    const baseUrl = getBaseUrl();
    this.baseUrl = config.baseUrl || `${baseUrl}/api/perplexity`;
    this.apiKey = config.apiKey;
    this.defaultModel = config.model || "pplx-7b-chat";
  }

  async createChatCompletion(params: {
    messages: Message[];
    model?: string;
  }): Promise<ChatResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: params.messages,
          model: params.model || this.defaultModel,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API request failed");
      }

      return await response.json();
    } catch (error) {
      console.error("Perplexity API error:", error);
      throw error;
    }
  }
}
