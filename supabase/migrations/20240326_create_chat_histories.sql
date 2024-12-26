-- Create chat_histories table if it doesn't exist
CREATE TABLE IF NOT EXISTS chat_histories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  thread_id text NOT NULL,
  speaker_id text NOT NULL,
  message text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster message retrieval by thread
CREATE INDEX IF NOT EXISTS chat_histories_thread_id_idx ON chat_histories(thread_id);

-- Enable RLS
ALTER TABLE chat_histories ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow all operations for authenticated users" ON chat_histories;
DROP POLICY IF EXISTS "Allow anonymous users to read and write chat histories" ON chat_histories;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users"
    ON chat_histories
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read and write chat histories"
    ON chat_histories
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON TABLE chat_histories TO authenticated;
GRANT ALL ON TABLE chat_histories TO anon; 