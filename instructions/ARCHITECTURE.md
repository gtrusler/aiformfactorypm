# System Architecture

## System Design

### Multi-Context Processing (MCP)

The system uses a Multi-Context Processing approach to enhance chat responses:

1. **Vector Store**

   - Uses Supabase with pgvector extension
   - Stores document embeddings for efficient similarity search
   - Maintains metadata for context tracking

2. **Embedding Generation**

   - Uses OpenAI's text-embedding-ada-002 model
   - Generates embeddings for both documents and queries
   - Handles batch processing for efficiency

3. **Context Retrieval**

   - Implements semantic search using vector similarity
   - Configurable relevance thresholds
   - Returns top matching documents

4. **Chat History Management**

   - Stores complete conversation history in Supabase
   - Implements message deduplication
   - Formats history for AI consumption
   - Maintains thread-based conversations

5. **Chat Processing**

   - Uses Claude 3 Sonnet model
   - Enhances prompts with relevant context
   - Integrates chat history seamlessly
   - Maintains consistent system prompts

## Data Flow

1. User sends a message
2. System retrieves chat history from Supabase
3. System generates embedding for the message
4. Vector store returns relevant context
5. Chat history and context are added to system prompt
6. Enhanced prompt sent to Claude
7. Response stored in chat history

## Components

### AnthropicClient

- Handles chat message processing
- Manages context inclusion
- Interfaces with Supabase
- Maintains consistent system prompts

### MessageHandler

- Processes incoming messages
- Retrieves and formats chat history
- Integrates vector store context
- Handles message deduplication

### ChatInterface

- Manages user interactions
- Displays message history
- Handles file attachments
- Provides real-time feedback

### Vector Store

- Stores document embeddings
- Provides semantic search
- Manages metadata
- Handles batch operations

## Deployment

- Next.js application on Vercel
- Supabase for database and vector store
- OpenAI for embeddings
- Anthropic for chat responses

## Schema

### ai_knowledge_vectors

```sql
create table ai_knowledge_vectors (
  id bigint primary key generated always as identity,
  content text not null,
  metadata jsonb,
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### chat_histories

```sql
create table chat_histories (
  id bigint primary key generated always as identity,
  thread_id text not null,
  speaker_id text not null,
  message text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```
