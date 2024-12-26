export type ToolType = "search" | "image" | "webpage";

export interface ToolResponse {
  type: ToolType;
  content: string | string[];
  metadata?: Record<string, unknown>;
}

export interface ToolHandler {
  execute: (params: Record<string, unknown>) => Promise<ToolResponse>;
  validate: (params: Record<string, unknown>) => boolean;
}

export class ToolError extends Error {
  constructor(
    message: string,
    public type: ToolType,
    public details?: unknown
  ) {
    super(message);
    this.name = "ToolError";
  }
}

export interface ToolConfig {
  handlers: Record<ToolType, ToolHandler>;
}
