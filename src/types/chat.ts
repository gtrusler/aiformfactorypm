import type { ReactNode } from "react";

export type MessageRole = "user" | "assistant" | "system";

export type ToolType =
  | "code_search"
  | "file_read"
  | "terminal_command"
  | "file_edit"
  | "directory_list"
  | "text_search"
  | "file_search"
  | "file_delete";

export type ToolStatus = "pending" | "complete" | "error";

export interface ToolResponse {
  tool: ToolType;
  result: unknown;
  error?: string;
}

export interface MessageMetadata {
  toolStatus?: ToolStatus;
  toolType?: ToolType;
  result?: unknown;
  error?: boolean;
  suggestions?: string[];
  toolCalls?: Array<{
    tool: ToolType;
    status: ToolStatus;
    result?: unknown;
  }>;
}

export interface Message {
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}

export interface AIResponse {
  content: string;
  toolResults?: ToolResponse[];
  metadata?: {
    toolCalls?: Array<{
      tool: ToolType;
      status: ToolStatus;
      result?: unknown;
    }>;
  };
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: Message) => Promise<AIResponse>;
}
