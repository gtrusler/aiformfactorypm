-- Enable the pgvector extension if not already enabled
create extension if not exists vector;

-- Create the vector matching function
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