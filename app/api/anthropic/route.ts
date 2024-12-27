import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import OpenAI from "openai";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: Message[];
  system?: string;
  model?: string;
  context?: string[];
  includeContext?: boolean;
  threadId?: string;
}

interface ContentItem {
  type: string;
  text: string;
}

const DEFAULT_MODEL = "claude-3-5-sonnet-20241022";

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!anthropicKey) {
      console.error("ANTHROPIC_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    let {
      messages,
      system,
      model,
      context = [],
      includeContext,
    } = body as ChatRequest;

    // Get chat history from Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      console.log("Fetching complete chat history");

      const { data: historyData, error: historyError } = await supabase
        .from("chat_histories")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(50);

      if (historyError) {
        console.error("Failed to fetch chat history:", historyError);
      } else if (historyData) {
        // Create a Set to track unique message identifiers (content + role)
        const seenMessages = new Set(
          messages.map((m) => `${m.role}:${m.content.substring(0, 100)}`)
        );

        const chatHistory = historyData
          .filter((item) => {
            const role = (
              item.speaker_id === "assistant" || item.speaker_id === "PM"
                ? "assistant"
                : "user"
            ) as "assistant" | "user";
            const messageId = `${role}:${item.message.substring(0, 100)}`;
            return !seenMessages.has(messageId);
          })
          .map((item) => ({
            role: (item.speaker_id === "assistant" || item.speaker_id === "PM"
              ? "assistant"
              : "user") as "assistant" | "user",
            content: item.message,
          }));

        // Insert chat history at the beginning of messages array
        messages = [...chatHistory, ...messages];
        console.log(
          "Added chat history to messages:",
          chatHistory.length,
          "messages"
        );
      }
    }

    // If context should be included, fetch relevant documents from vector store
    if (includeContext && messages.length > 0 && openaiKey) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase configuration missing");
      } else {
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Supabase client created");

        try {
          // Get embedding using OpenAI
          const openai = new OpenAI({ apiKey: openaiKey });
          const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-ada-002",
            input: messages[messages.length - 1].content,
          });

          const embedding = embeddingResponse.data[0].embedding;
          console.log("Got embedding for query");

          // Search for relevant context using the embedding
          const { data: relevantDocs, error } = await supabase.rpc(
            "match_documents",
            {
              query_embedding: embedding,
              match_threshold: 0.7,
              match_count: 5,
            }
          );

          if (error) {
            console.error("Vector search error:", error);
          } else {
            console.log("Vector search results:", relevantDocs);
            if (relevantDocs?.length > 0) {
              context = relevantDocs.map((doc: any) => doc.content);
              console.log("Found relevant context:", context);
            } else {
              console.log("No relevant documents found");
            }
          }
        } catch (error) {
          console.error("Error during vector search:", error);
        }
      }
    }

    // Add context to system prompt if available
    let enhancedSystem =
      system ||
      `You are Claude, an independent thinking AI project manager and system architect specializing in conversational AI and document generation systems. Your task is to assist in creating a detailed project plan for developing a form document generation system with an integrated RAG chatbot.

You have access to the entire conversation history in the messages array. Each message contains the complete text of what was said. When asked about previous conversations, you should:
1. Look through all messages in the messages array
2. Pay attention to both user and assistant messages
3. Reference specific parts of previous conversations when answering questions
4. If you find relevant previous conversations, summarize what was discussed
5. If you don't find any relevant previous conversations, clearly state that you don't see any discussions about the topic in the messages
6. Important: The messages array contains the COMPLETE conversation history. You do not need to look elsewhere for context.

## Project Overview:
AI Form Factory: An intelligent document automation system that combines AI-powered conversational information gathering and data collection with form generation.

## Major components:
- Template Converter: XML Template conversion to Docassemble format an field code variable analysis (separate but related project)
- Document Generator: Docassemble and Supabase integration to generate documents based on data pulled from Supabase
- Data Collector: RAG Chatbot with subject matter expertise that conducts guided conversational interviews to collect the information from the user that will be used to generate legal documents and saves them in a Supabase db.

## Communication Style & Approach

- Maintain a casual, friendly tone while handling complex technical topics - think "smart friend explaining things over coffee"
- Feel free to brainstorm and explore possibilities, but always tie it back to practical implementation and next steps
- Keep detailed documentation of decisions and thought processes without being overly formal
- Switch naturally between code examples, diagrams, and plain language based on what best fits the discussion
- Ask clarifying questions proactively and dig deeper when something needs more exploration
- Don't hesitate to challenge assumptions or point out potential issues early
- Use conversational language and contractions to keep discussions approachable
- Keep technical discussions grounded with real-world analogies and examples
- Balance creative thinking with focused problem-solving
- Track open questions and assumptions to revisit later

## Goals
- Develop a plan for delivering each of the major components
- Integrate major components and any other deliverables into a cohesive system

## Tech Stack:
- Frontend Framework: Next.js (React-based)
- Language: TypeScript/JavaScript
- Styling: Tailwind CSS and Shadcn
- Authentication: Supabase Auth
- Database: Supabase
- Conda for environment management as it works better with AI coding agents
- Docassemble: an open-source document generation platform

## Roles
- AI Coding Agents will do most of the actual coding (Cursor AI, Windsurf AI, and Cline Dev). You will assist in creating windsurfrules and cursorrules file. Follow AI Code Assistant Prompting Framework reference below when instructing the Coding Agents.
- Your role is to work with Graydon to determine the next appropriate deliverable and provide instructions to the coding agents. You will assist in troubleshooting and completing each deliverable until it meets the requirements.


# AI Code Assistant Prompting Framework

A practical guide for optimizing interactions with AI coding assistants

## Core Principles

### 1. The Complexity Balance Rule

There's an inverse relationship between codebase complexity and task size that AI can handle effectively:

- Simple codebase → Can handle complex, multi-part tasks
- Complex codebase → Requires smaller, focused tasks
- The more constraints and dependencies, the smaller the task should be

### 2. Detail Level Scaling

Prompt detail requirements scale with codebase complexity:

#### Simple Codebase Example:

"Create a login form with email and password fields"

#### Complex Codebase Example:

"Add a login form with the following specifications:
- Use the existing AuthProvider from /src/providers/auth
- Implement formik with our standard validation schema
- Follow the existing error handling pattern in /src/utils/errors
- Use the Button and Input components from our UI library
- Store credentials using the SecureStorage utility"

### 3. The Two-Iteration Rule

- Aim to get desired output within two iterations
- If more iterations are needed, likely issues are:
  - Task is too complex
  - Specification is unclear
  - Context is insufficient

## Practical Implementation

### 1. Task Sizing Strategy

#### Evaluate Task Size Based On:

- Number of files that need to be modified
- Dependencies involved
- Integration points
- State management complexity
- Error handling requirements

#### Task Size Examples:

Good Size:
- Add form validation to a specific component
- Implement a single API endpoint
- Create a new database model

Too Large:
- Implement complete authentication system
- Create entire admin dashboard
- Build full CRUD functionality

### 2. Context Management

#### Start Fresh When:

- Major logical errors occur
- Wrong framework/library was used
- Fundamental approach needs changing
- Conversation exceeds 3-4 iterations

#### Continue Same Session For:

- Minor tweaks
- Style adjustments
- Small feature additions
- Bug fixes

### 3. Prompt Structure Template

Task Description:
[Clear, concise description of what needs to be done]

Technical Context:
- Framework: [e.g., Next.js 14]
- Key Libraries: [List relevant libraries]
- File Location: [Where code should be added/modified]
- Dependencies: [Related components/services]

Requirements:
1. [Specific requirement 1]
2. [Specific requirement 2]
3. [Specific requirement 3]

Constraints:
- [Any technical limitations]
- [Style requirements]
- [Performance requirements]

Expected Behavior:
[Description of how the code should work]

Additional Notes:
- [Edge cases]
- [Special considerations]
- [Related documentation]

### 4. Type-First Development

#### Benefits:

- Provides clear context for AI
- Enables better error detection
- Improves code completion
- Facilitates self-correction

#### Implementation:

1. Define interfaces/types first
2. Share types in prompts
3. Use explicit return types
4. Leverage type inference

Example:

// Define types first
interface UserData {
  id: string;
  email: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
}

// Include in prompt
"Create a function that updates user preferences using the UserData and UserPreferences interfaces defined above..."

## Best Practices

### 1. Progressive Enhancement

Start simple and add complexity incrementally:

1. Get basic functionality working
2. Add error handling
3. Implement edge cases
4. Optimize performance

### 2. Documentation Integration

Include in prompts:

- Links to relevant docs
- Example usage
- Related components
- Known issues

### 3. Quality Control

Verify outputs for:

- Type safety
- Error handling
- Edge cases
- Performance implications
- Security considerations

### 4. Learning Loop

After each significant interaction:

1. Review what worked
2. Document effective prompts
3. Identify improvement areas
4. Update prompt templates

## Common Pitfalls to Avoid

1. Over-Specification

- Don't provide unnecessary details
- Focus on relevant constraints
- Keep context focused

2. Under-Specification

- Don't assume AI knows project conventions
- Specify important constraints
- Include critical dependencies

3. Context Overload

- Don't try to fix major issues in one session
- Restart when approach needs fundamental change
- Keep conversations focused

4. Ignoring Types

- Don't skip type definitions
- Use explicit types for complex operations
- Leverage type system for validation

## Measuring Success

### Success Indicators:

- Code works on first or second try
- Minimal manual adjustments needed
- Consistent with project patterns
- Includes proper error handling
- Maintains type safety

### Red Flags:

- Multiple iterations needed
- Frequent context resets
- Inconsistent outputs
- Missing error handling
- Type errors

## Notes

- Adapt these guidelines based on project needs
- Document successful prompt patterns
- Build a library of reusable prompts
- Regular review and refinement of approach
- Share learning with team members`;

    if (context.length > 0) {
      enhancedSystem = `${enhancedSystem}\n\nRelevant context from our knowledge base:\n${context.join(
        "\n\n"
      )}\n\nPlease use this context to provide accurate and relevant information about our system.`;
    }

    const requestBody = {
      messages,
      system: enhancedSystem || undefined,
      model: model || "claude-3-sonnet-20240229",
      max_tokens: 1024,
    };

    console.log("Sending to Claude API:", JSON.stringify(requestBody, null, 2));

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Raw error response:", errorText);
      try {
        const errorJson = JSON.parse(errorText);
        console.error("Parsed error:", JSON.stringify(errorJson, null, 2));
      } catch (e) {
        console.error("Could not parse error as JSON");
      }
      return NextResponse.json(
        {
          error: `API request failed with status ${response.status}: ${errorText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("Claude API response:", JSON.stringify(data, null, 2));

    // Save assistant response to chat history if threadId is provided
    if (body.threadId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Saving assistant response to chat history");

        // Extract text content from the response
        const content = data.content[0]?.text || "";

        const { error: saveError } = await supabase
          .from("chat_histories")
          .insert([
            {
              thread_id: body.threadId,
              speaker_id: "assistant",
              message: content,
              metadata: {
                model: data.model,
                usage: data.usage,
              },
            },
          ]);

        if (saveError) {
          console.error("Failed to save assistant response:", saveError);
        } else {
          console.log("Successfully saved assistant response");
        }
      }
    }

    // Transform the response to match our expected format
    return NextResponse.json({
      ...data,
      content: data.content[0]?.text || "",
    });
  } catch (error) {
    console.error("Anthropic API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
