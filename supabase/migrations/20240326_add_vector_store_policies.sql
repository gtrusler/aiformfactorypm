-- Enable RLS on ai_knowledge_vectors
ALTER TABLE ai_knowledge_vectors ENABLE ROW LEVEL SECURITY;

-- Allow all operations for authenticated users
CREATE POLICY "Allow all operations for authenticated users"
    ON ai_knowledge_vectors
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to read vectors
CREATE POLICY "Allow anonymous users to read vectors"
    ON ai_knowledge_vectors
    FOR SELECT
    TO anon
    USING (true);

-- Grant execute permission on match_documents function to anon and authenticated roles
GRANT EXECUTE ON FUNCTION match_documents TO anon, authenticated; 