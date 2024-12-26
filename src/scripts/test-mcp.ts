const { AnthropicClient } = require("../libs/api/anthropic");

async function testMCP() {
  const client = new AnthropicClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  // Test queries
  const testQueries = [
    "What kind of forms can I create?",
    "How does the AI help with form creation?",
    "Tell me about the customization options",
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
      });

      console.log(
        "Response:",
        typeof response.content === "string"
          ? response.content
          : response.content.text
      );
      console.log("\n---\n");
    } catch (error) {
      console.error("Error processing query:", error);
    }
  }
}

testMCP().catch(console.error);
