import { ToolManager } from "./manager";

async function example(): Promise<void> {
  // Initialize the tool manager
  const manager = new ToolManager();

  try {
    // Example 1: Search using Perplexity
    console.log("\nSearch Example:");
    const searchResult = await manager.executeTool("search", {
      query: "What is TypeScript?",
    });
    console.log("Search Result:", searchResult);

    // Example 2: Generate an image using DALL-E 3
    console.log("\nImage Generation Example:");
    const imageResult = await manager.executeTool("image", {
      prompt: "A beautiful sunset over mountains",
      config: {
        quality: "hd",
        style: "vivid",
      },
    });
    console.log("Image URLs:", imageResult.content);

    // Example 3: Read webpage content
    console.log("\nWebpage Reading Example:");
    const webpageResult = await manager.executeTool("webpage", {
      url: "https://example.com",
      config: {
        timeout: 5000,
      },
    });
    console.log(
      "Webpage Content:",
      webpageResult.content.slice(0, 200) + "..."
    );

    // Example 4: Execute multiple tools in parallel
    console.log("\nParallel Execution Example:");
    const multipleResults = await manager.executeMultiple([
      {
        type: "search",
        params: { query: "Latest TypeScript features" },
      },
      {
        type: "image",
        params: {
          prompt: "A modern IDE interface",
          config: { quality: "standard" },
        },
      },
    ]);
    console.log("Multiple Results:", multipleResults);

    // Example 5: Parameter validation
    console.log("\nValidation Example:");
    const isValid = manager.validateParams("search", {
      query: "Valid query",
    });
    console.log("Is valid:", isValid);

    const isInvalid = manager.validateParams("search", {
      query: "", // Empty query
    });
    console.log("Is invalid:", isInvalid);
  } catch (error) {
    console.error("Error in example:", error);
  }
}

// Run the example
if (require.main === module) {
  example().catch(console.error);
}
