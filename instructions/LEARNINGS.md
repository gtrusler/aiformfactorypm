# Technical Learnings

## Current Status (as of [2024-12-27])

### Implementation Status

#### ✅ Completed

- Multi-Context Processing (MCP) integration with Supabase
- Vector store setup and configuration
- Chat interface with context-aware responses
- Test script for MCP verification
- Claude model update to latest version (claude-3-sonnet-20240229)
- Basic authentication system
- Initial API routes and endpoints
- Core UI components implementation
- Chat interface with file upload support
  - Image and text file handling
  - Base64 encoding for images
  - Type-safe message metadata
  - Proper TypeScript integration
- AI System Prompt Enhancement
  - Major components breakdown
  - Communication style guidelines
  - AI Code Assistant Prompting Framework
  - Task sizing strategies
  - Type-first development approach
- Basic chat interface with message history
- Supabase integration for message storage
- Chat history retrieval and formatting
- System prompt framework for AI project management
- Message deduplication in chat history

#### 🚧 In Progress

- Fine-tuning context relevance thresholds
- Optimizing vector search performance
- Enhancing response quality with better context
- Payment processing integration
- Advanced template management system
- Document generation pipeline
- Testing Supabase-Docassemble integration
- Document generation from Supabase data
- RAG chatbot implementation

### Immediate Next Steps

1. Monitor and adjust vector search thresholds
2. Implement context caching for performance
3. Add more comprehensive test coverage
4. Document best practices for content ingestion
5. Complete payment processing integration
6. Enhance template management system
7. Consider adding file size limits
8. Add support for more file types
9. Implement file compression for large images
10. Add progress indicators for file uploads
11. Create test Supabase table for document generation
12. Set up Docassemble connection to Supabase
13. Implement basic document template
14. Test data flow from Supabase to generated document

### Testing Checklist

- [x] Basic chat functionality
- [x] Context retrieval from vector store
- [x] Model response quality
- [x] Error handling
- [ ] Performance optimization
- [ ] Load testing
- [ ] Payment processing flows
- [ ] Template generation
- [ ] Test large file uploads
- [ ] Verify image preview functionality
- [ ] Test multiple file uploads
- [ ] Verify file type restrictions
- [ ] Test error handling scenarios
- [ ] Supabase table creation and data insertion
- [ ] Docassemble-Supabase connection
- [ ] Basic document generation
- [ ] Data flow validation

## Solutions

### MCP Integration

- Successfully integrated Multi-Context Processing with Supabase
- Implemented vector search for relevant document retrieval
- Enhanced chat responses with contextual information
- Updated to latest Claude model for improved responses

### Vector Search

- Using OpenAI's text-embedding-ada-002 for embeddings
- Implemented match_documents function in Supabase
- Configured relevance thresholds for better matches
- Added error handling for embedding creation

### Chat Interface

- Enhanced AnthropicClient with MCP capabilities
- Added context inclusion in chat messages
- Improved error handling and response formatting
- Implemented chat history tracking

### File Upload Implementation

- Used FileReader API for handling file uploads
- Implemented base64 encoding for images
- Added type declarations for message attachments
- Used TypeScript declaration merging for extending types

### AI Prompting Framework Implementation

#### Core Principles

- Complexity Balance Rule: Task size inversely proportional to codebase complexity
- Detail Level Scaling: More complex codebases require more detailed prompts
- Two-Iteration Rule: Aim for success within two iterations

#### Task Sizing Strategy

- Evaluate based on:
  - Number of files to modify
  - Dependencies involved
  - Integration points
  - State management complexity
  - Error handling requirements

#### Context Management

- Start fresh for:
  - Major logical errors
  - Wrong framework/library usage
  - Fundamental approach changes
  - Extended conversations (3-4+ iterations)
- Continue session for:
  - Minor tweaks
  - Style adjustments
  - Small feature additions
  - Bug fixes

#### Type-First Development

- Define interfaces/types before implementation
- Share types in prompts
- Use explicit return types
- Leverage type inference

## Patterns

### State Management

- Using React hooks for local state
- Implementing reducers for complex state
- Using context for shared state

### Error Handling

- Consistent error response format
- Type-safe error handling
- Proper error messages and logging

### Component Design

- Client/Server component separation
- Reusable base components
- Consistent styling patterns

### Message Metadata Extension

```typescript
interface FileAttachment {
  type: "image" | "text";
  content: string;
  name: string;
}

declare module "@/types/chat" {
  interface MessageMetadata {
    attachments?: FileAttachment[];
  }
}
```

### File Processing Pattern

```typescript
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};
```

### AI Prompt Structure

```markdown
Task Description:
[Clear, concise description]

Technical Context:

- Framework/Libraries
- File Locations
- Dependencies

Requirements:

1. Specific requirements
2. Constraints
3. Expected behavior

Additional Notes:

- Edge cases
- Special considerations
- Documentation links
```

### Progressive Enhancement

1. Basic functionality first
2. Add error handling
3. Implement edge cases
4. Optimize performance

## Performance Insights

- Chat interface renders efficiently
- API routes handle errors gracefully
- Tool execution framework in place
- Base64 encoding increases payload size
- Consider implementing file compression
- May need to add file size limits
- Consider chunked upload for large files
- Message deduplication reduces context size
- Structured message format improves parsing efficiency
- Proper error handling prevents cascading failures
- Clear system prompts reduce confusion and rework

## Tools and Libraries

### Core

- Next.js 14.2.21
- TypeScript
- React

### Payment Processing

- Stripe
- LemonSqueezy

### AI Services

- Replicate
- RunPod

### UI

- Tailwind CSS
- Custom components

### FileReader API for file processing

- Lucide React for file type icons

### AI Integration

- Claude 3 Sonnet (claude-3-sonnet-20240229)
- Vector store for context
- AI Code Assistant Framework

### Core Stack

- Next.js for frontend framework
- Supabase for database and auth
- Claude API for AI interactions
- Docassemble for document generation

### Development Tools

- TypeScript for type safety
- Tailwind CSS for styling
- Shadcn for UI components
- Conda for environment management

## Best Practices

### AI Prompting

- Keep tasks focused and appropriately sized
- Provide necessary context without overload
- Use type-first development approach
- Document successful prompt patterns
- Regular review and refinement

### Code Quality

- Type safety first
- Consistent error handling
- Performance considerations
- Security best practices
