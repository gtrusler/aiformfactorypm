import type { Message, ToolType } from "@/types/chat";

interface DemoStep {
  trigger: string;
  response: {
    content: string;
    suggestedPrompts?: string[];
    tools?: Array<{
      type: ToolType;
      input: unknown;
      output: unknown;
    }>;
  };
}

interface DemoScenario {
  name: string;
  description: string;
  sequence: DemoStep[];
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    name: "Form Builder",
    description: "Create and customize forms with AI assistance",
    sequence: [
      {
        trigger: "Create a contact form",
        response: {
          content:
            "I'll help you create a contact form. What fields do you need?",
          suggestedPrompts: [
            "Add name and email fields",
            "Add validation rules",
            "Preview the form",
          ],
        },
      },
      {
        trigger: "Add name and email fields",
        response: {
          content: "I'll add those fields with proper validation.",
          tools: [
            {
              type: "code_search",
              input: { query: "contact form fields" },
              output: {
                fields: [
                  { name: "name", type: "text", validation: "required" },
                  {
                    name: "email",
                    type: "email",
                    validation: "required|email",
                  },
                ],
              },
            },
          ],
          suggestedPrompts: [
            "Add a message field",
            "Add phone number field",
            "Show form preview",
          ],
        },
      },
      {
        trigger: "Add validation rules",
        response: {
          content: "Here are the recommended validation rules for your form:",
          tools: [
            {
              type: "code_search",
              input: { query: "form validation rules" },
              output: {
                validations: {
                  name: { required: true, minLength: 2 },
                  email: { required: true, email: true },
                  message: { required: true, minLength: 10 },
                },
              },
            },
          ],
        },
      },
    ],
  },
  {
    name: "AI Research",
    description: "Get instant insights on any topic",
    sequence: [
      {
        trigger: "What's new in AI safety?",
        response: {
          content: "Let me search for recent AI safety developments...",
          tools: [
            {
              type: "text_search",
              input: { query: "latest AI safety research developments" },
              output: {
                results: [
                  "New frameworks for AI alignment",
                  "Progress in interpretability research",
                  "Advances in robustness testing",
                ],
              },
            },
          ],
          suggestedPrompts: [
            "Tell me more about AI alignment",
            "Show recent papers",
            "Explain interpretability",
          ],
        },
      },
      {
        trigger: "Show recent papers",
        response: {
          content: "Here are some notable recent papers on AI safety:",
          tools: [
            {
              type: "text_search",
              input: { query: "recent AI safety papers" },
              output: {
                papers: [
                  {
                    title: "Advances in AI Alignment",
                    url: "https://arxiv.org/example1",
                    summary: "Novel approaches to ensuring AI systems...",
                  },
                  {
                    title: "Interpretability Methods",
                    url: "https://arxiv.org/example2",
                    summary: "New techniques for understanding AI decisions...",
                  },
                ],
              },
            },
          ],
        },
      },
    ],
  },
  {
    name: "Visual Creation",
    description: "Generate and customize images with AI",
    sequence: [
      {
        trigger: "Generate a modern office design",
        response: {
          content: "I'll create a visualization of a modern office space...",
          tools: [
            {
              type: "file_search",
              input: {
                prompt:
                  "A modern, minimalist office space with natural light, featuring clean lines, ergonomic furniture, and biophilic design elements",
              },
              output: {
                images: ["modern-office-1.jpg", "modern-office-2.jpg"],
              },
            },
          ],
          suggestedPrompts: [
            "Make it more minimalist",
            "Add more plants",
            "Show different angle",
          ],
        },
      },
      {
        trigger: "Add more plants",
        response: {
          content: "I'll update the design with more biophilic elements...",
          tools: [
            {
              type: "file_search",
              input: {
                prompt:
                  "Modern office space with abundant indoor plants, living walls, and natural materials",
              },
              output: {
                images: ["biophilic-office-1.jpg", "biophilic-office-2.jpg"],
              },
            },
          ],
        },
      },
    ],
  },
];

export const INITIAL_PROMPT = {
  role: "assistant" as const,
  content:
    "Hello! I can help you create forms, research topics, or generate images. What would you like to explore?",
  metadata: {
    suggestions: DEMO_SCENARIOS.map((scenario) => scenario.name),
  },
};

export const FALLBACK_RESPONSE = {
  role: "assistant" as const,
  content: "I can help you with the following:",
  metadata: {
    suggestions: DEMO_SCENARIOS.map(
      (scenario) => `${scenario.name}: ${scenario.description}`
    ),
  },
};
