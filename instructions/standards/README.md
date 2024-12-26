# Coding Standards

## TypeScript

- Use strict type checking with `strict: true` in tsconfig
- Avoid `any` type - use `unknown` if type is truly unknown
- Use `interface` for objects that can be extended
- Use `type` for unions/intersections and simple types
- Always define return types for functions
- Use generics for reusable components/functions

## React

- Use functional components with FC type
- Custom hooks for shared logic and state management
- Implement memoization (useMemo, useCallback) for expensive operations
- Define Props interface for each component
- Use controlled components for forms
- Implement error boundaries for component trees
- Use React.Suspense for code splitting

## Model Context Protocol (MCP) Integration

### General Principles

- Follow official MCP specification (spec.modelcontextprotocol.io)
- Implement standardized client-server communication
- Use typed message formats for all AI interactions
- Maintain local-first architecture where possible

### MCP Client Implementation

- Use official MCP SDK for communication
- Implement proper error handling for API responses
- Follow MCP message format specification
- Handle rate limiting and retries appropriately

### Data Flow

```typescript
interface MCPMessage {
  type: "user" | "assistant" | "system";
  content: string;
  metadata?: {
    timestamp: string;
    toolCalls?: ToolCall[];
    context?: string[];
  };
}
```

### Tool Integration

- Register tools using MCP tool registration format
- Implement tool validation and error handling
- Follow MCP security guidelines for tool access
- Document all available tools and their requirements

### Context Management

- Use vector store for relevant context retrieval
- Implement proper context windowing
- Follow MCP context format specifications
- Maintain context relevance scoring

## State Management

- Use hooks for local component state
- Context API for shared application state
- Avoid prop drilling more than 2 levels deep
- Use reducers for complex state logic
- Implement proper state initialization
- Implement MCP state management patterns
- Store MCP session data appropriately

## Styling

- Use Tailwind utility classes for styling
- Extend shadcn/ui components for consistent UI
- Custom components should follow shadcn/ui patterns
- Use CSS variables for theme values
- Maintain responsive design principles
- Follow accessibility guidelines

## File Organization

- Feature-based structure for scalability
- Shared components in `/components/ui`
- MCP clients in `/lib/mcp`
- Tool implementations in `/lib/mcp/tools`
- Context handlers in `/lib/mcp/context`
- Types in `types.ts` per feature
- Constants in `constants.ts`
- Routes in `app/` directory (Next.js 13+ convention)

## Git Practices

- Use conventional commits (feat, fix, docs, etc.)
- Create feature branches from main
- Follow PR template guidelines
- Maintain linear git history
- Write meaningful commit messages
- Keep commits atomic and focused

## Testing

- Unit tests for utilities and hooks
- Component testing with Vitest
- E2E testing with Playwright
- MCP integration testing
- Tool execution testing
- Context retrieval testing
- Test coverage requirements:
  - Utilities: 90%+
  - Components: 80%+
  - E2E: Critical paths
  - MCP Integration: 85%+
- Write meaningful test descriptions

## Performance

- Implement code splitting
- Use proper memoization
- Optimize images and assets
- Monitor bundle size
- Use performance monitoring tools
- Implement MCP request batching
- Optimize context retrieval
- Cache frequently used contexts

## Security

- Validate all inputs
- Implement proper authentication
- Use HTTPS
- Follow OWASP guidelines
- Keep dependencies updated
- Handle sensitive data properly
- Follow MCP security guidelines for tool access
- Implement proper MCP request signing

## Documentation

- Document all public APIs
- Add JSDoc comments for complex functions
- Keep README files updated
- Document environment setup
- Include troubleshooting guides
- Document MCP tool configurations
- Maintain tool usage examples
- Document context management patterns

## MCP-Specific Patterns

### Tool Registration

```typescript
interface MCPTool {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required: string[];
  };
}
```

### Context Format

```typescript
interface MCPContext {
  type: "text" | "code" | "data";
  content: string;
  metadata?: Record<string, unknown>;
}
```

### Error Handling

```typescript
interface MCPError {
  code: string;
  message: string;
  details?: unknown;
}
```

## API Design

- Follow RESTful principles
- Use proper HTTP methods
- Implement proper error responses
- Version APIs appropriately
- Document API endpoints
- Follow MCP API guidelines for tool endpoints
- Implement rate limiting
- Use proper authentication/authorization

## Code Quality

- Use ESLint for code linting
- Prettier for code formatting
- Maintain consistent code style
- Regular code reviews
- Use TypeScript strict mode
- Follow SOLID principles
- Keep functions small and focused
- Use meaningful variable names

## Development Workflow

- Use feature flags for new features
- Implement proper logging
- Follow CI/CD best practices
- Regular dependency updates
- Proper environment configuration
- Meaningful error messages
- Documentation updates with changes
- Regular performance monitoring

## Error Handling

- Implement proper error boundaries
- Use typed error classes
- Meaningful error messages
- Proper error logging
- User-friendly error displays
- MCP-specific error handling
- Tool execution error recovery
- Context retrieval fallbacks

## Monitoring and Logging

- Implement application monitoring
- Error tracking and reporting
- Performance monitoring
- User behavior analytics
- Tool usage metrics
- Context retrieval stats
- API endpoint monitoring
- Resource usage tracking
