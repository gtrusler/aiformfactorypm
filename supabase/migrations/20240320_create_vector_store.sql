-- Enable the pgvector extension
create extension if not exists vector;

-- Create the ai_knowledge_vectors table
create table if not exists ai_knowledge_vectors (
  id bigserial primary key,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create a function to search for similar vectors
create or replace function match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
returns table (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    id,
    content,
    metadata,
    1 - (ai_knowledge_vectors.embedding <=> query_embedding) as similarity
  from ai_knowledge_vectors
  where 1 - (ai_knowledge_vectors.embedding <=> query_embedding) > match_threshold
  order by ai_knowledge_vectors.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- Create an index for faster similarity searches
create index if not exists ai_knowledge_vectors_embedding_idx 
  on ai_knowledge_vectors 
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100); 