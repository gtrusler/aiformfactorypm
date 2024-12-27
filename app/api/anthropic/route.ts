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
      `You are a helpful AI assistant. You have access to the entire conversation history in the messages array. Each message contains the complete text of what was said.

When asked about previous conversations, you should:
1. Look through all messages in the messages array
2. Pay attention to both user and assistant messages
3. Reference specific parts of previous conversations when answering questions
4. If you find relevant previous conversations, summarize what was discussed
5. If you don't find any relevant previous conversations, clearly state that you don't see any discussions about the topic in the messages

Important: The messages array contains the COMPLETE conversation history. You do not need to look elsewhere for context.`;

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
