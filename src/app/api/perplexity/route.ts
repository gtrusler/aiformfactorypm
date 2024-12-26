import { NextResponse } from "next/server";

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

interface SearchRequest {
  query: string;
}

interface ChatRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const isSearchRequest = "query" in body;

    if (isSearchRequest) {
      const { query } = body as SearchRequest;
      // Use pplx-70b-online for better search results
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          },
          body: JSON.stringify({
            model: "pplx-70b-online",
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful AI assistant focused on providing accurate and up-to-date information. When asked about news or current events, provide specific, factual information with recent developments.",
              },
              {
                role: "user",
                content: query,
              },
            ],
            temperature: 0.1, // Lower temperature for more focused responses
            max_tokens: 1024,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API request failed");
      }

      const data = await response.json();
      return NextResponse.json({
        text: data.choices[0].message.content,
        references: [], // Could be enhanced with actual references if needed
      });
    } else {
      // Handle regular chat completion request
      const { messages, model, temperature, max_tokens } = body as ChatRequest;
      const response = await fetch(
        "https://api.perplexity.ai/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          },
          body: JSON.stringify({
            model: model || process.env.PERPLEXITY_MODEL || "pplx-7b-online",
            messages,
            temperature: temperature || 0.7,
            max_tokens: max_tokens || 1024,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "API request failed");
      }

      const data = await response.json();
      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Perplexity API error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
