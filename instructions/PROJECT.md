# Project Overview

## Goals

- Create an AI-powered system for dynamic form generation and management
- Implement intelligent form field detection and processing
- Develop RAG-based chatbot for guided form completion
- Enable automated document generation from form responses
- Provide secure document storage and management

## Tech Stack

### Core Technologies

- Frontend Framework: Next.js (React-based)
- Language: TypeScript/JavaScript
- Styling: Tailwind CSS
- Authentication: Supabase Auth
- Database: Supabase with pgvector
- Vector Store: OpenAI Embeddings + Supabase pgvector

### UI Components

- Headless UI for accessible components
- TipTap for rich text editing
- React Virtual for virtualized lists

### AI Integration

- Claude 3 Sonnet for chat interface
- OpenAI ada-002 for embeddings
- RAG implementation using pgvector

### Development Tools

- ESLint for code linting
- TypeScript for type safety
- Patch-package for dependency patching
- Conda for environment management

## Vector Store Implementation

The project uses a hybrid approach for vector storage and retrieval:

- OpenAI's text-embedding-ada-002 model for generating embeddings
- Supabase's pgvector extension for similarity search
- Server-side API endpoint for secure vector operations
- Client-side integration through message handler

### Sample Templates

Current document templates in vector store:

1. Waiver of Service
   - Civil proceedings document
   - Handles service of process acknowledgment
2. Power of Attorney
   - Financial and legal decisions
   - Agent designation and powers
3. Last Will and Testament
   - Estate planning document
   - Beneficiary and executor management

## Resources and URLs

- Development: http://localhost:3000
- Chat Interface: http://localhost:3000/chat
- Supabase Dashboard: https://app.supabase.com
- OpenAI Dashboard: https://platform.openai.com
- Anthropic Console: https://console.anthropic.com

## Team

- Project Manager: Claude AI
- Development: Cursor AI
- Infrastructure: Supabase
