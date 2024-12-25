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

## State Management

- Use hooks for local component state
- Context API for shared application state
- Avoid prop drilling more than 2 levels deep
- Use reducers for complex state logic
- Implement proper state initialization

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
- Utilities and helpers in `/lib`
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
- Test coverage requirements:
  - Utilities: 90%+
  - Components: 80%+
  - E2E: Critical paths
- Write meaningful test descriptions

## Performance

- Implement code splitting
- Use proper memoization
- Optimize images and assets
- Monitor bundle size
- Use performance monitoring tools

## Security

- Validate all inputs
- Implement proper authentication
- Use HTTPS
- Follow OWASP guidelines
- Keep dependencies updated
- Handle sensitive data properly

## Documentation

- Document all public APIs
- Add JSDoc comments for complex functions
- Keep README files updated
- Document environment setup
- Include troubleshooting guides
