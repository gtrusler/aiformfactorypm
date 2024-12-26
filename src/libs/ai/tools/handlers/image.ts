import type { ToolHandler, ToolResponse } from "../types";
import { ToolError } from "../types";

interface ImageGenerationConfig {
  model?: string;
  quality?: "standard" | "hd";
  style?: "vivid" | "natural";
  size?: "1024x1024" | "1792x1024" | "1024x1792";
}

export class ImageToolHandler implements ToolHandler {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.openai.com/v1/images/generations";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENAI_API_KEY || "";
    if (!this.apiKey) {
      throw new ToolError("OpenAI API key is required", "image");
    }
  }

  async execute(params: Record<string, unknown>): Promise<ToolResponse> {
    try {
      if (!this.validate(params)) {
        throw new ToolError("Invalid image generation parameters", "image");
      }

      const prompt = params.prompt as string;
      const config = (params.config as Partial<ImageGenerationConfig>) || {};

      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt,
          n: 1,
          quality: config.quality || "standard",
          style: config.style || "vivid",
          size: config.size || "1024x1024",
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "Image generation failed");
      }

      const data = await response.json();
      return {
        type: "image",
        content: data.data.map((img: { url: string }) => img.url),
        metadata: {
          model: "dall-e-3",
          ...config,
        },
      };
    } catch (error) {
      throw new ToolError(
        `Image generation failed: ${error.message}`,
        "image",
        error
      );
    }
  }

  validate(params: Record<string, unknown>): boolean {
    if (typeof params.prompt !== "string" || params.prompt.length === 0) {
      return false;
    }

    if (params.config) {
      const config = params.config as Partial<ImageGenerationConfig>;
      const validQualities = ["standard", "hd"];
      const validStyles = ["vivid", "natural"];
      const validSizes = ["1024x1024", "1792x1024", "1024x1792"];

      if (
        (config.quality && !validQualities.includes(config.quality)) ||
        (config.style && !validStyles.includes(config.style)) ||
        (config.size && !validSizes.includes(config.size))
      ) {
        return false;
      }
    }

    return true;
  }
}
