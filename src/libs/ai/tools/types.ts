export type ToolType = "search" | "image" | "webpage";

export interface ToolResponse {
  type: ToolType;
  content: string | string[];
  metadata?: Record<string, unknown>;
}

export interface ToolHandler {
  execute(params: Record<string, unknown>): Promise<ToolResponse>;
  validate(params: Record<string, unknown>): boolean;
}

export interface ToolConfig {
  handlers: {
    [K in ToolType]?: ToolHandler;
  };
}

export class ToolError extends Error {
  constructor(
    message: string,
    public readonly toolType: ToolType,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "ToolError";
  }
}
