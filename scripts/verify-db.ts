import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase configuration");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log("Verifying database setup...\n");

  // Check if chat_histories table exists
  const { data: tables, error: tablesError } = await supabase
    .from("chat_histories")
    .select("*", { count: "exact", head: true });

  if (tablesError) {
    console.error("Error accessing chat_histories table:", tablesError);
    return;
  }

  console.log("✓ chat_histories table exists");
  console.log("Current record count:", tables?.length ?? 0);

  // Test insert
  const testMessage = {
    thread_id: "verify-" + Date.now(),
    speaker_id: "system",
    message: "Verification test message",
    metadata: { test: true },
  };

  console.log("\nTesting insert...");
  const { error: insertError } = await supabase
    .from("chat_histories")
    .insert([testMessage]);

  if (insertError) {
    console.error("Insert test failed:", insertError);
    return;
  }

  console.log("✓ Insert successful");

  // Test select
  console.log("\nTesting select...");
  const { data: selectData, error: selectError } = await supabase
    .from("chat_histories")
    .select("*")
    .eq("thread_id", testMessage.thread_id)
    .single();

  if (selectError) {
    console.error("Select test failed:", selectError);
    return;
  }

  console.log("✓ Select successful");
  console.log("Retrieved record:", selectData);

  // Test delete
  console.log("\nCleaning up test data...");
  const { error: deleteError } = await supabase
    .from("chat_histories")
    .delete()
    .eq("thread_id", testMessage.thread_id);

  if (deleteError) {
    console.error("Delete test failed:", deleteError);
    return;
  }

  console.log("✓ Delete successful");
  console.log("\nDatabase verification complete!");
}

verifyDatabase().catch(console.error);
