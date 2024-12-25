# Component Structure Guidelines

## Folder Structure

```
components/
├── feature/              # Feature-specific components
│   ├── ComponentName/
│   │   ├── index.ts     # Main export
│   │   ├── types.ts     # Component types
│   │   └── utils.ts     # Component utilities
├── ui/                  # Shared UI components
│   ├── Button/
│   ├── Input/
│   └── ...
└── hooks/              # Shared hooks
```

## Naming Conventions

- PascalCase for component files and components (e.g., `Button.tsx`)
- camelCase for utilities and hooks (e.g., `useFormState.ts`)
- kebab-case for CSS classes and file names
- Prefix hooks with 'use' (e.g., `useAuth`)

## Component Template

```tsx
import { type FC } from "react";
import { cn } from "@/lib/utils";

interface ComponentProps {
  /** Description of the prop */
  label: string;
  /** Optional className for styling */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * Component description
 * @example
 * <Component label="Example">
 *   Content
 * </Component>
 */
export const Component: FC<ComponentProps> = ({
  label,
  className,
  children,
}) => {
  return (
    <div className={cn("base-styles", className)}>
      <h2>{label}</h2>
      {children}
    </div>
  );
};
```

## Best Practices

### Component Structure

- One component per file
- Export from index.ts
- Keep components focused and small
- Use composition over inheritance

### Props

- Use TypeScript interfaces
- Document props with JSDoc
- Provide default props when appropriate
- Use prop spreading sparingly

### Hooks

- Extract complex logic to custom hooks
- Follow React hooks rules
- Memoize callbacks and values
- Handle loading and error states

### Styling

- Use Tailwind utility classes
- Leverage shadcn/ui components
- Use CSS variables for theming
- Support dark mode

### Performance

- Use React.memo for expensive renders
- Implement proper loading states
- Handle error boundaries
- Use code splitting

### Testing

- Write unit tests for logic
- Test component rendering
- Test user interactions
- Test error states

## Examples

### Form Component

```tsx
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface FormData {
  email: string;
  password: string;
}

export const LoginForm: FC = () => {
  const { register, handleSubmit } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    // Handle submission
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input {...register("email")} type="email" />
      <Input {...register("password")} type="password" />
      <Button type="submit">Login</Button>
    </form>
  );
};
```

### Custom Hook

```tsx
import { useState, useCallback } from "react";

export const useToggle = (initial = false) => {
  const [state, setState] = useState(initial);

  const toggle = useCallback(() => {
    setState((prev) => !prev);
  }, []);

  return [state, toggle] as const;
};
```
