import type { Message, ToolType } from "@/types/chat";

interface DemoInteraction {
  trigger: string;
  response: {
    content: string;
    tools?: Array<{
      type: ToolType;
      input: unknown;
      output: unknown;
    }>;
  };
}

export const INITIAL_MESSAGES: Message[] = [
  {
    role: "assistant",
    content:
      "Hello! I can help you create forms, search information, and generate images. What would you like to do?",
  },
];

export const DEMO_INTERACTIONS: DemoInteraction[] = [
  {
    trigger: "Create a contact form",
    response: {
      content:
        "I'll help you create a contact form with proper validation. Here's a suggested structure:",
      tools: [
        {
          type: "code_search",
          input: { query: "contact form template" },
          output: {
            fields: [
              { name: "name", type: "text", validation: "required" },
              { name: "email", type: "email", validation: "required|email" },
              { name: "subject", type: "text", validation: "required|min:3" },
              {
                name: "message",
                type: "textarea",
                validation: "required|min:10",
              },
            ],
          },
        },
      ],
    },
  },
  {
    trigger: "Show me the latest AI news",
    response: {
      content: "I'll search for the latest developments in AI technology.",
      tools: [
        {
          type: "text_search",
          input: { query: "latest artificial intelligence developments" },
          output: {
            results: [
              "New breakthrough in language model efficiency",
              "AI assists in scientific discovery",
              "Advances in computer vision technology",
            ],
          },
        },
      ],
    },
  },
  {
    trigger: "Generate an image of a modern office",
    response: {
      content: "I'll create a modern office space visualization for you.",
      tools: [
        {
          type: "file_search",
          input: { query: "modern office design" },
          output: {
            images: ["office-modern-1.jpg", "office-design-2.jpg"],
          },
        },
      ],
    },
  },
];

export const SUGGESTED_PROMPTS = [
  "Create a contact form",
  "Show me the latest AI news",
  "Generate an image of a modern office",
  "Help me with form validation",
];

export const TOOL_DESCRIPTIONS = {
  code_search: "Search and generate form code",
  text_search: "Find relevant information",
  file_search: "Search for files and images",
  file_read: "Read configuration files",
} as const;
