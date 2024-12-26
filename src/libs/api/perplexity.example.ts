import { PerplexityClient } from "./perplexity";

async function example(): Promise<void> {
  // Initialize client
  const client = new PerplexityClient();

  try {
    // Example 1: Basic chat completion
    const response = await client.createChatCompletion({
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "What is TypeScript?",
        },
      ],
    });
    console.log("Basic Response:", response.choices[0].message.content);

    // Example 2: Streaming chat completion
    console.log("\nStreaming Response:");
    await client.streamChatCompletion(
      {
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant.",
          },
          {
            role: "user",
            content: "Explain React hooks in simple terms.",
          },
        ],
      },
      (message) => {
        process.stdout.write(message);
      },
      (error) => {
        console.error("Stream Error:", error);
      }
    );

    // Example 3: With custom configuration
    const customResponse = await client.createChatCompletion({
      model: "pplx-7b-online",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant.",
        },
        {
          role: "user",
          content: "What are the best practices for API design?",
        },
      ],
      temperature: 0.5,
      max_tokens: 500,
    });
    console.log(
      "\n\nCustom Response:",
      customResponse.choices[0].message.content
    );
  } catch (error) {
    console.error("Error in example:", error);
  }
}

// Run the example
if (require.main === module) {
  example().catch(console.error);
}
