import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { AnthropicClient } from "@/libs/api/anthropic";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  threadId?: string;
  context?: string[];
  includeContext?: boolean;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ChatRequest;
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Get chat history first
    let chatHistory: Message[] = [];
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      console.log("Fetching complete chat history");

      const { data: historyData, error: historyError } = await supabase
        .from("chat_histories")
        .select("*")
        .order("created_at", { ascending: true });

      if (historyError) {
        console.error("Failed to fetch chat history:", historyError);
      } else if (historyData) {
        chatHistory = historyData.map((item) => ({
          role: item.speaker_id === "assistant" ? "assistant" : "user",
          content: item.message,
        }));
        console.log(
          "Successfully fetched chat history:",
          chatHistory.length,
          "messages"
        );
      }
    }

    // Save user message to chat history if threadId is provided
    if (body.threadId) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (supabaseUrl && supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        console.log("Saving user message to chat history");

        const { error: saveError } = await supabase
          .from("chat_histories")
          .insert([
            {
              thread_id: body.threadId,
              speaker_id: "user",
              message: body.message,
            },
          ]);

        if (saveError) {
          console.error("Failed to save user message:", saveError);
        } else {
          console.log("Successfully saved user message");
        }
      }
    }

    // Create messages array with chat history and current message
    const messages = [
      ...chatHistory,
      { role: "user" as const, content: body.message },
    ];

    console.log("Sending to Anthropic with", messages.length, "messages");

    // Process with Anthropic
    const anthropicClient = new AnthropicClient();
    const response = await anthropicClient.createMessage({
      messages,
      system:
        "You are a helpful AI assistant. You have access to the entire conversation history across all threads. When asked about previous conversations, you should:\n\n1. Look through all messages in the chat history\n2. Reference specific parts of previous conversations when answering questions\n3. If you find relevant previous conversations, summarize what was discussed\n4. If you don't find any relevant previous conversations, clearly state that you don't see any discussions about the topic in the chat history",
      threadId: body.threadId,
      includeContext: body.includeContext,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
