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
              match_threshold: 0.7, // Lower threshold to get more matches
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
    let enhancedSystem = system || "";
    if (context.length > 0) {
      enhancedSystem = `${enhancedSystem}\n\nRelevant context from our knowledge base:\n${context.join(
        "\n\n"
      )}\n\nPlease use this context to provide accurate and relevant information about our system.`;
    }

    // Transform messages to Anthropic's format
    const transformedMessages = messages.map((msg) => ({
      role: msg.role,
      content: [
        {
          type: "text",
          text: msg.content,
        },
      ],
    }));

    const requestBody = {
      messages: transformedMessages,
      system: enhancedSystem || undefined,
      model: model || DEFAULT_MODEL,
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

        const content = data.content
          .filter((item: ContentItem) => item.type === "text")
          .map((item: ContentItem) => item.text)
          .join("");

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
    if (data.content && Array.isArray(data.content)) {
      const content = data.content
        .filter((item: ContentItem) => item.type === "text")
        .map((item: ContentItem) => item.text)
        .join("");

      return NextResponse.json({
        ...data,
        content,
      });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Anthropic API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
