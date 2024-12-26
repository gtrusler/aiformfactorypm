const fetch = require("node-fetch");
global.fetch = fetch;

const { AnthropicClient } = require("../../dist/libs/api/anthropic");

async function testMCP() {
  const client = new AnthropicClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    baseUrl: "http://localhost:3000/api/anthropic",
  });

  // Test queries
  const testQueries = [
    "What kind of forms can I create in AI Form Factory?",
    "How does the AI help with form creation in this system?",
    "What customization options are available in AI Form Factory?",
  ];

  console.log("Testing chat with context...\n");

  for (const query of testQueries) {
    console.log(`Query: "${query}"`);

    try {
      const response = await client.createMessage({
        messages: [
          {
            role: "user",
            content: query,
          },
        ],
        threadId: "test-thread",
        includeContext: true,
        model: "claude-3-5-sonnet-20241022",
        system:
          "You are an AI assistant for AI Form Factory. Use the provided context to give accurate information about our system's capabilities.",
      });

      console.log(
        "Response:",
        typeof response.content === "string"
          ? response.content
          : response.content.text
      );
      console.log("\n---\n");
    } catch (error) {
      console.error("Error processing query:", error.message);
      if (error.cause) {
        console.error("Cause:", error.cause.message);
      }
    }
  }
}

// Make sure the dev server is running
console.log(
  "Make sure the Next.js development server is running (npm run dev)"
);
console.log("Testing connection to API...");

fetch("http://localhost:3000/api/anthropic")
  .then(() => {
    console.log("API connection successful\n");
    testMCP().catch(console.error);
  })
  .catch((error) => {
    console.error(
      "Error: Could not connect to API. Make sure the Next.js development server is running (npm run dev)"
    );
    console.error("Details:", error.message);
    process.exit(1);
  });
