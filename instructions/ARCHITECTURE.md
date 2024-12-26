# System Architecture

## System Design

### Frontend Architecture

```
src/
├── components/
│   ├── app-components/     # Application-specific components
│   │   └── Chat/          # Chat interface components
│   ├── base/              # Base UI components
│   └── landing-components/ # Landing page components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions
```

### Backend Architecture

```
app/
├── api/
│   ├── ai/               # AI service integrations
│   │   ├── replicate/    # Replicate API
│   │   └── runpod/      # RunPod API
│   ├── stripe/          # Stripe payment processing
│   │   ├── create-checkout/
│   │   └── create-portal/
│   └── webhook/         # Webhook handlers
│       └── lemonsqueezy/
└── chat/                # Chat interface pages
```

## Data Flow

### Chat System

1. User sends message via ChatInterface
2. Message processed by chat handler
3. Tool execution if required
4. Response rendered to user

### Payment Processing

1. User initiates payment
2. Stripe/LemonSqueezy checkout created
3. User completes payment
4. Webhook received and processed
5. User access updated

## Components

### Core Components

- ChatInterface: Main chat interaction
- MessageBubble: Message display
- ToolExecutionStatus: Tool status display

### Payment Components

- Stripe integration
- LemonSqueezy integration
- Webhook handlers

### AI Components

- Replicate service integration
- RunPod service integration
- Tool execution framework

## Deployment

### Current Environment

- Local development
- Next.js development server
- Environment variables for API keys

### Planned Infrastructure

- Production deployment
- Database integration
- User authentication
- Monitoring and logging

## Schema

### Message Types

```typescript
type MessageRole = "user" | "assistant" | "system";

interface Message {
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}

interface MessageMetadata {
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
```

### Tool Types

```typescript
type ToolType =
  | "code_search"
  | "file_read"
  | "terminal_command"
  | "file_edit"
  | "directory_list"
  | "text_search"
  | "file_search"
  | "file_delete";

type ToolStatus = "pending" | "complete" | "error";
```

### Payment Integration

```typescript
interface StripeCheckout {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  customerId?: string;
}

interface LemonSqueezyWebhook {
  meta: {
    custom_data: {
      user_id: string;
    };
    event_name: string;
  };
  data: {
    attributes: {
      variant_id: number;
      status: string;
    };
  };
}
```
