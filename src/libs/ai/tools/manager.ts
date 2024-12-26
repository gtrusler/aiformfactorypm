import type { ToolType, ToolResponse, ToolConfig } from "./types";
import { ToolError } from "./types";
import { SearchToolHandler } from "./handlers/search";
import { ImageToolHandler } from "./handlers/image";
import { WebpageToolHandler } from "./handlers/webpage";

export class ToolManager {
  private handlers: ToolConfig["handlers"];

  constructor(config?: Partial<ToolConfig>) {
    this.handlers = {
      search: new SearchToolHandler(),
      image: new ImageToolHandler(),
      webpage: new WebpageToolHandler(),
      ...config?.handlers,
    };
  }

  async executeTool(
    type: ToolType,
    params: Record<string, unknown>
  ): Promise<ToolResponse> {
    const handler = this.handlers[type];
    if (!handler) {
      throw new ToolError(`Tool type '${type}' not found`, type);
    }

    try {
      return await handler.execute(params);
    } catch (error) {
      if (error instanceof ToolError) {
        throw error;
      }
      throw new ToolError(
        `Tool execution failed: ${error.message}`,
        type,
        error
      );
    }
  }

  validateParams(type: ToolType, params: Record<string, unknown>): boolean {
    const handler = this.handlers[type];
    if (!handler) {
      throw new ToolError(`Tool type '${type}' not found`, type);
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
