-- Create chat_speakers table
CREATE TABLE IF NOT EXISTS chat_speakers (
  id text PRIMARY KEY,
  name text NOT NULL,
  type text NOT NULL CHECK (type IN ('user', 'assistant', 'system')),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE chat_speakers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations for authenticated users"
    ON chat_speakers
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow anonymous users to read and write chat speakers"
    ON chat_speakers
    FOR ALL
    TO anon
    USING (true)
    WITH CHECK (true);

-- Grant permissions
GRANT ALL ON TABLE chat_speakers TO authenticated;
GRANT ALL ON TABLE chat_speakers TO anon;

-- Insert default speakers
INSERT INTO chat_speakers (id, name, type) VALUES
  ('user', 'User', 'user'),
  ('assistant', 'PM', 'assistant'),
  ('system', 'System', 'system')
ON CONFLICT (id) DO UPDATE 
SET name = EXCLUDED.name;

-- Add foreign key to chat_histories if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.table_constraints 
    WHERE constraint_name = 'chat_histories_speaker_id_fkey'
  ) THEN
    ALTER TABLE chat_histories
      ADD CONSTRAINT chat_histories_speaker_id_fkey
      FOREIGN KEY (speaker_id)
      REFERENCES chat_speakers(id)
      ON DELETE RESTRICT
      ON UPDATE CASCADE;
  END IF;
END $$; 