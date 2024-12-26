"use client";

import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export default function TestPage() {
  const [status, setStatus] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  const addStatus = (message: string) => {
    setStatus((prev) => [...prev, message]);
  };

  useEffect(() => {
    const runTests = async () => {
      try {
        // Check environment variables
        addStatus("Checking environment variables...");
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!url || !key) {
          throw new Error(
            `Missing environment variables: ${!url ? "URL" : ""} ${
              !key ? "KEY" : ""
            }`
          );
        }
        addStatus("✓ Environment variables present");
        addStatus(`URL: ${url}`);

        // Test database connection
        addStatus("\nTesting database connection...");
        const { data: tables, error: tableError } = await supabase
          .from("chat_histories")
          .select("*")
          .limit(1);

        if (tableError) {
          throw new Error(`Database connection failed: ${tableError.message}`);
        }
        addStatus("✓ Database connection successful");

        // Test insert
        addStatus("\nTesting insert operation...");
        const testMessage = {
          thread_id: "test-" + Date.now(),
          speaker_id: "user",
          message: "Test message",
          metadata: { test: true },
        };

        const { error: insertError } = await supabase
          .from("chat_histories")
          .insert([testMessage]);

        if (insertError) {
          throw new Error(`Insert failed: ${insertError.message}`);
        }
        addStatus("✓ Insert successful");

        // Test select
        addStatus("\nTesting select operation...");
        const { data: selectData, error: selectError } = await supabase
          .from("chat_histories")
          .select("*")
          .eq("thread_id", testMessage.thread_id)
          .single();

        if (selectError) {
          throw new Error(`Select failed: ${selectError.message}`);
        }
        addStatus("✓ Select successful");
        addStatus(`Retrieved data: ${JSON.stringify(selectData, null, 2)}`);

        // Test delete
        addStatus("\nTesting delete operation...");
        const { error: deleteError } = await supabase
          .from("chat_histories")
          .delete()
          .eq("thread_id", testMessage.thread_id);

        if (deleteError) {
          throw new Error(`Delete failed: ${deleteError.message}`);
        }
        addStatus("✓ Delete successful");

        addStatus("\nAll tests completed successfully!");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(message);
        addStatus(`❌ Error: ${message}`);
      }
    };

    runTests();
  }, [supabase]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Test Page</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded">
        <pre className="whitespace-pre-wrap">{status.join("\n")}</pre>
      </div>
    </div>
  );
}
