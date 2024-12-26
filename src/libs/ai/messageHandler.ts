import type { AIResponse } from "../../types/chat";
import { PerplexityClient, AnthropicClient } from "../api";
import type { VectorSearchResult } from "./vectorStore";

export interface AIMessageHandlerConfig {
  perplexityApiKey?: string;
  anthropicApiKey?: string;
}

export class AIMessageHandler {
  private config: AIMessageHandlerConfig;
  private perplexityClient: PerplexityClient;
  private anthropicClient: AnthropicClient;
  private readonly systemPrompt = `You are an AI project manager and system architect specializing in document generation systems. Your task is to create a detailed project plan for developing a form document generation system with an integrated RAG chatbot. You will break down the project into manageable phases and provide instructions for AI coding agents (such as Windsurf AI or Cursor AI) to implement each phase.

Project Overview:
AI Form Factory: An intelligent document automation system that combines AI-powered form generation with advanced processing capabilities.

## Goals
- Create an AI-powered system for dynamic form generation and management
- Implement intelligent form field detection and processing
- Develop RAG-based chatbot for guided form completion
- Enable automated document generation from form responses
- Provide secure document storage and management

Tech Stack:
- Frontend Framework: Next.js (React-based)
- Language: TypeScript/JavaScript
- Styling: Tailwind CSS
- Authentication: Supabase Auth
- Database: Supabase
- UI Components:
  - Headless UI for accessible components
  - TipTap for rich text editing
  - React Virtual for virtualized lists
- Cloud Services: AWS SDK integration
- Development Tools:
  - ESLint for code linting
  - TypeScript for type safety
  - Patch-package for dependency patching

The project uses conda for environment management as it works better with Windsurf AI and Cursor AI.

Additionally, the project incorporates Docassemble, an open-source document generation platform, for document templating and generation.

Core MVP Features:
- User authentication (using Supabase Auth)
- Basic form interface for collecting: Name, Phone, Email
- Chatbot interface (leveraging Claude/OpenAI integration)
- Document generation from collected data
- Database storage (using Supabase)

Advanced Features (Post-MVP):
- Complex template management
- Template conversion system
- Support for variable data structures
- Vector store for enhanced chatbot knowledge

Technical Requirements:
- Multi-user system
- Secure file storage (using Cloudflare R2)
- Rate limiting
- Usage tracking
- Type safety (using TypeScript)

Template System Requirements:
- Handle specific coding patterns (P####, A####, PA###)
- Support conditional logic in templates
- Import capability for existing templates
- Flexible data structure for simple and complex fields

Your role is to work with Graydon to determine the next appropriate deliverable and provide instructions to the coding AI (Windsurf AI or Cursor AI). You will assist in troubleshooting and completing each deliverable until it meets the requirements.`;

  constructor(config: AIMessageHandlerConfig) {
    this.config = config;
    this.perplexityClient = new PerplexityClient({
      apiKey: config.perplexityApiKey,
    });
    this.anthropicClient = new AnthropicClient({
      apiKey: config.anthropicApiKey,
      model: "claude-3-sonnet-20240229",
    });
  }

  private async getRelevantContext(message: string): Promise<string> {
    try {
      const response = await fetch("/api/vector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: message }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch context");
      }

      const { results } = (await response.json()) as {
        results: VectorSearchResult[];
      };

      if (!results?.length) return "";

      // Format context for the AI
      const context = results
        .map(
          (doc) =>
            `Context from ${doc.metadata.source || "document"}:\n${doc.content}`
        )
        .join("\n\n");

      return `\nRelevant context for your reference:\n${context}\n`;
    } catch (error) {
      console.error("Error retrieving context:", error);
      return "";
    }
  }

  async processMessage(message: string): Promise<AIResponse> {
    try {
      // Get relevant context from vector store
      const context = await this.getRelevantContext(message);

      // Combine user message with context
      const enhancedMessage = context ? `${message}\n\n${context}` : message;

      const aiResponse = await this.anthropicClient.createMessage({
        messages: [
          {
            role: "user",
            content: enhancedMessage,
          },
        ],
        system: this.systemPrompt,
        model: "claude-3-sonnet-20240229",
      });

      // Extract the text content from the response
      const content =
        typeof aiResponse.content === "string"
          ? aiResponse.content
          : aiResponse.content.text ||
            "I encountered an error processing your request.";

      return {
        messageId: crypto.randomUUID(),
        content,
        status: "completed",
      };
    } catch (error) {
      console.error("Error processing message:", error);
      return {
        messageId: crypto.randomUUID(),
        content:
          "I encountered an error while processing your request. Please try again.",
        status: "error",
      };
    }
  }
}
