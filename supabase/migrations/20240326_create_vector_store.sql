-- Enable the pgvector extension if not already enabled
CREATE EXTENSION IF NOT EXISTS vector;

-- Create the ai_knowledge_vectors table if it doesn't exist
CREATE TABLE IF NOT EXISTS ai_knowledge_vectors (
  id bigserial primary key,
  content text not null,
  embedding vector(1536) not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create the match_documents function
CREATE OR REPLACE FUNCTION match_documents(
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id bigint,
  content text,
  metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ai_knowledge_vectors.id,
    ai_knowledge_vectors.content,
    ai_knowledge_vectors.metadata,
    1 - (ai_knowledge_vectors.embedding <=> query_embedding) as similarity
  FROM ai_knowledge_vectors
  WHERE 1 - (ai_knowledge_vectors.embedding <=> query_embedding) > match_threshold
  ORDER BY ai_knowledge_vectors.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;

-- Create an index for faster similarity searches
CREATE INDEX IF NOT EXISTS ai_knowledge_vectors_embedding_idx 
  ON ai_knowledge_vectors 
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Enable RLS
ALTER TABLE ai_knowledge_vectors ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON ai_knowledge_vectors;
DROP POLICY IF EXISTS "Allow anonymous users to read vectors" ON ai_knowledge_vectors;
DROP POLICY IF EXISTS "Allow anonymous users to read and write vectors" ON ai_knowledge_vectors;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users"
    ON ai_knowledge_vectors
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read and write vectors"
    ON ai_knowledge_vectors
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON TABLE ai_knowledge_vectors TO authenticated;
GRANT ALL ON TABLE ai_knowledge_vectors TO anon;
GRANT USAGE ON SEQUENCE ai_knowledge_vectors_id_seq TO authenticated, anon;
GRANT EXECUTE ON FUNCTION match_documents TO anon, authenticated;

-- Grant vector type permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated; 