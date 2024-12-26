import type { ReactNode } from "react";

export type MessageRole = "user" | "assistant" | "system" | "PM";

export type ToolType =
  | "search"
  | "image"
  | "webpage"
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
  tool: string;
  result: string | string[] | null;
  error?: string;
}

export interface MessageMetadata {
  threadId?: string;
  toolCalls?: Array<{
    tool: string;
    status: "complete" | "error";
    result: string | string[] | null;
    error?: string;
  }>;
  [key: string]: unknown;
}

export interface Message {
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}

export interface AIResponse {
  messageId: string;
  content: string;
  status: "completed" | "error";
  role?: MessageRole;
  metadata?: MessageMetadata;
}

export interface AIMessageHandlerConfig {
  availableTools: Record<string, unknown>;
  perplexityModel: string;
  perplexityApiKey: string | undefined;
}

export interface ChatContextType {
  messages: Message[];
  isLoading: boolean;
  error: Error | null;
  sendMessage: (message: Message) => Promise<AIResponse>;
}
