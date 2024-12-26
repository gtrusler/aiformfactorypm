import type { ToolHandler, ToolResponse } from "../types";
import { ToolError } from "../types";

interface WebpageConfig {
  selector?: string;
  timeout?: number;
  waitUntil?: "load" | "domcontentloaded" | "networkidle0" | "networkidle2";
}

export class WebpageToolHandler implements ToolHandler {
  private readonly defaultTimeout = 30000; // 30 seconds

  async execute(params: Record<string, unknown>): Promise<ToolResponse> {
    try {
      if (!this.validate(params)) {
        throw new ToolError("Invalid webpage parameters", "webpage");
      }

      const url = params.url as string;
      const config = (params.config as Partial<WebpageConfig>) || {};

      const response = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; AIFormFactoryBot/1.0)",
        },
        signal: AbortSignal.timeout(config.timeout || this.defaultTimeout),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch webpage: ${response.status}`);
      }

      const html = await response.text();

      // Basic HTML to text conversion
      const text = this.htmlToText(html, config.selector);

      return {
        type: "webpage",
        content: text,
        metadata: {
          url,
          status: response.status,
          contentType: response.headers.get("content-type"),
          length: text.length,
        },
      };
    } catch (error) {
      throw new ToolError(
        `Webpage reading failed: ${error.message}`,
        "webpage",
        error
      );
    }
  }

  validate(params: Record<string, unknown>): boolean {
    if (typeof params.url !== "string" || !this.isValidUrl(params.url)) {
      return false;
    }

    if (params.config) {
      const config = params.config as Partial<WebpageConfig>;
      const validWaitUntil = [
        "load",
        "domcontentloaded",
        "networkidle0",
        "networkidle2",
      ];

      if (
        (config.timeout &&
          (typeof config.timeout !== "number" || config.timeout < 0)) ||
        (config.waitUntil && !validWaitUntil.includes(config.waitUntil))
      ) {
        return false;
      }
    }

    return true;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  private htmlToText(html: string, selector?: string): string {
    // Basic HTML to text conversion
    // In a production environment, you might want to use a proper HTML parser
    return html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
}
