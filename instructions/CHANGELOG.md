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

### Fixed

- Chat interface interactivity issues
- Message handling and display
- API route error handling
- Tool execution framework reliability
- Model compatibility issues
- Test script execution in development
- Resolved client-side Supabase key issues
- Fixed vector store context retrieval in chat interface

### Security

- Enhanced type safety for API responses
- Improved webhook error handling
- Secure payment processing implementation
- Vector store access policies
