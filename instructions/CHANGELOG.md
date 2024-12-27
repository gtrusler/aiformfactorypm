# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added

- Multi-Context Processing (MCP) features
  - Supabase vector store integration
  - Context-aware chat responses
  - Document relevance scoring
  - Vector search functionality
- Chat interface enhancements
  - Interactive message input
  - Message history display
  - Agent responses
  - Tool execution framework
- AI service integrations
  - Claude 3 Sonnet model integration
  - Replicate API integration
  - RunPod API integration
- Payment processing setup
  - Stripe integration
  - LemonSqueezy webhook handling
- Base UI components
  - Message bubbles
  - Tool execution status
  - Loading indicators
  - Chat showcase components
- Vector store integration for enhanced chatbot context
  - Implemented VectorStore class for document embeddings and retrieval
  - Created server-side API endpoint for vector operations
  - Added sample legal document templates (Waiver of Service, Power of Attorney, Last Will and Testament)
  - Integrated vector search with Claude chat interface
- File upload functionality in chat interface
  - Support for image and text file uploads
  - Preview attachments before sending
  - Display attachments in chat history
  - Type-safe implementation with proper error handling
- Enhanced chat history functionality
  - Improved message deduplication
  - Better context handling in conversations
  - Explicit system prompts for chat history awareness
  - Improved message retrieval from Supabase
  - Added XML-like message formatting for better context preservation
  - Implemented chat history integration with Claude API

### Changed

- Updated Claude model to `claude-3-sonnet-20240229`
- Enhanced chat interface implementation
  - Improved input field interactivity
  - Better layout and styling
  - Enhanced message handling
- Improved error handling
  - Type-safe error responses
  - Consistent error formats
  - Better error messages
- Enhanced AnthropicClient with MCP capabilities
- Modified chat API routes for context inclusion
- Updated message handler to include relevant context from vector store
- Moved vector operations to server-side to protect API keys
- Updated AI system prompt with new project structure and prompting framework
  - Added major components breakdown
  - Enhanced communication style guidelines
  - Included comprehensive AI Code Assistant Prompting Framework
  - Updated tech stack and roles
  - Added detailed task sizing and implementation strategies
- Updated system prompt with comprehensive project details
  - Added detailed project overview and major components
  - Enhanced communication style guidelines
  - Included tech stack specifications
  - Added AI Code Assistant Prompting Framework
  - Clarified roles and responsibilities

### Fixed

- Chat history retrieval and context issues
  - Resolved message duplication in chat history
  - Fixed system prompt overrides
  - Improved chat history integration with Claude
- Chat interface interactivity issues
- Message handling and display
- API route error handling
- Tool execution framework reliability
- Model compatibility issues
- Test script execution in development
- Resolved client-side Supabase key issues
- Fixed vector store context retrieval in chat interface
- Resolved chat history retrieval issues
  - Fixed message formatting in `getChatHistory` method
  - Improved message passing to Claude API
  - Enhanced context handling in conversations

### Security

- Enhanced type safety for API responses
- Improved webhook error handling
- Secure payment processing implementation
- Vector store access policies
- Protected API keys in server-side operations
- Improved error handling for sensitive operations
- Enhanced data validation and sanitization

### Technical

- Implemented proper message deduplication in chat history
- Updated Anthropic API version to 2023-06-01
- Enhanced error handling and logging for API responses
