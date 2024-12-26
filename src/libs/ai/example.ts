import { AIMessageHandler } from "./messageHandler";
import { createAIMessageHandlerConfig } from "./tools";

async function example(): Promise<void> {
  // Initialize the AI message handler with available tools
  const config = createAIMessageHandlerConfig();
  const messageHandler = new AIMessageHandler(config);

  try {
    // Example 1: Process a message that requires search
    const searchResult = await messageHandler.processMessage(
      "Can you search for information about TypeScript?"
    );
    console.log("Search Result:", searchResult);

    // Example 2: Process a message that requires web page reading
    const webResult = await messageHandler.processMessage(
      "Can you read the content from https://example.com?"
    );
    console.log("Web Result:", webResult);

    // Example 3: Process a message that requires image generation
    const imageResult = await messageHandler.processMessage(
      "Generate an image of a sunset over mountains"
    );
    console.log("Image Result:", imageResult);

    // Example 4: Process a message that doesn't require any tools
    const simpleResult = await messageHandler.processMessage(
      "Hello, how are you?"
    );
    console.log("Simple Result:", simpleResult);
  } catch (error) {
    console.error("Error in example:", error);
  }
}

// Run the example
example().catch(console.error);
