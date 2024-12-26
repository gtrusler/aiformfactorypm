-- Function to get table definition
CREATE OR REPLACE FUNCTION get_table_definition(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'columns', jsonb_agg(
        jsonb_build_object(
          'name', column_name,
          'type', data_type,
          'nullable', is_nullable = 'YES',
          'default', column_default
        )
      )
    )
    FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = $1
  );
END;
$$;

-- Function to get table policies
CREATE OR REPLACE FUNCTION get_policies(table_name text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN (
    SELECT jsonb_agg(
      jsonb_build_object(
        'policy_name', polname,
        'roles', polroles,
        'cmd', polcmd,
        'qual', polqual::text,
        'with_check', polwithcheck::text
      )
    )
    FROM pg_policy
    WHERE polrelid = ('public.' || $1)::regclass
  );
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_table_definition TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_policies TO anon, authenticated; 