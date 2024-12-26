import type { ToolType, ToolResponse, ToolConfig } from "./types";
import { ToolError } from "./types";
import { SearchToolHandler } from "./handlers/search";
import { ImageToolHandler } from "./handlers/image";
import { WebpageToolHandler } from "./handlers/webpage";

export class ToolManager {
  private handlers: Required<ToolConfig["handlers"]>;

  constructor(config?: Partial<ToolConfig>) {
    // Get API keys from environment variables
    const openaiApiKey =
      process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY;

    // Initialize handlers with required configuration
    this.handlers = {
      search: new SearchToolHandler(),
      image: new ImageToolHandler(openaiApiKey),
      webpage: new WebpageToolHandler(),
      ...config?.handlers,
    } as Required<ToolConfig["handlers"]>;
  }

  async executeTool(
    type: ToolType,
    params: Record<string, unknown>
  ): Promise<ToolResponse> {
    const handler = this.handlers[type];
    if (!handler) {
      throw new ToolError(
        `Tool type '${type}' not available or not configured`,
        type
      );
    }

    try {
      return await handler.execute(params);
    } catch (error: unknown) {
      if (error instanceof ToolError) {
        throw error;
      }
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      throw new ToolError(
        `Tool execution failed: ${errorMessage}`,
        type,
        error
      );
    }
  }

  validateParams(type: ToolType, params: Record<string, unknown>): boolean {
    const handler = this.handlers[type];
    if (!handler) {
      throw new ToolError(
        `Tool type '${type}' not available or not configured`,
        type
      );
    }

    return handler.validate(params);
  }

  async executeMultiple(
    calls: Array<{ type: ToolType; params: Record<string, unknown> }>
  ): Promise<ToolResponse[]> {
    return Promise.all(
      calls.map(({ type, params }) => this.executeTool(type, params))
    );
  }

  getAvailableTools(): ToolType[] {
    return Object.keys(this.handlers) as ToolType[];
  }
}
