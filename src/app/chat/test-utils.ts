import type { Message, ToolType } from "@/types/chat";

export const TEST_SCENARIOS = {
  basic: [
    {
      role: "user",
      content: "Hi, I'd like to learn about artificial intelligence.",
    },
  ],
  search: [
    {
      role: "user",
      content: "What are the latest developments in quantum computing?",
    },
    {
      role: "user",
      content: "Explain the current state of AI safety research",
    },
  ],
  image: [
    {
      role: "user",
      content: "Create an image of a futuristic city with flying cars",
    },
    {
      role: "user",
      content: "Generate an artistic representation of quantum entanglement",
    },
  ],
  web: [
    {
      role: "user",
      content: "Summarize this article: https://arxiv.org/abs/2312.00752",
    },
    {
      role: "user",
      content:
        "What are the key points from: https://openai.com/blog/how-to-program-robots/",
    },
  ],
  combined: [
    {
      role: "user",
      content:
        "Search for recent quantum computing breakthroughs and create an image representing the most interesting one",
    },
    {
      role: "user",
      content:
        "Read this article and generate an image based on its main concept: https://arxiv.org/abs/2312.00752",
    },
  ],
} as const;

export const logTestResult = (
  scenario: string,
  message: Message,
  result: unknown,
  error?: Error
): void => {
  console.group(`Test Scenario: ${scenario}`);
  console.log("Message:", message);
  console.log("Result:", result);
  if (error) {
    console.error("Error:", error);
  }
  console.groupEnd();
};

export const executeToolTest = async (
  tool: ToolType,
  input: unknown,
  onToolExecution: (tool: ToolType, result: unknown) => Promise<unknown>
): Promise<unknown> => {
  try {
    const result = await onToolExecution(tool, input);
    return result;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Unknown error during tool execution");
  }
};
