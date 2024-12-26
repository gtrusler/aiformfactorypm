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
}

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const apiKey = process.env.PERPLEXITY_API_KEY;
    if (!apiKey) {
      console.error("PERPLEXITY_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const isSearchRequest = "query" in body;
    const apiUrl = "https://api.perplexity.ai/chat/completions";

    if (isSearchRequest) {
      const { query } = body as SearchRequest;
      console.log("Processing search request for query:", query);

      const requestBody = {
        model: "mistral-7b-instruct",
        messages: [
          {
            role: "system",
            content:
              "Be precise and concise. When asked about news or current events, provide specific, factual information with recent developments.",
          },
          {
            role: "user",
            content: query,
          },
        ],
        temperature: 0.2,
      };

      console.log(
        "Perplexity API request:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw error response:", errorText);
        return NextResponse.json(
          {
            error: `API request failed with status ${response.status}: ${errorText}`,
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log("Perplexity API response:", JSON.stringify(data, null, 2));

      return NextResponse.json({
        text: data.choices[0].message.content,
        references: [],
      });
    } else {
      const { messages, model, temperature } = body as ChatRequest;
      console.log(
        "Processing chat request with messages:",
        JSON.stringify(messages, null, 2)
      );

      const requestBody = {
        model: model || "mistral-7b-instruct",
        messages,
        temperature: temperature || 0.2,
      };

      console.log(
        "Perplexity API request:",
        JSON.stringify(requestBody, null, 2)
      );

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Raw error response:", errorText);
        return NextResponse.json(
          {
            error: `API request failed with status ${response.status}: ${errorText}`,
          },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log("Perplexity API response:", JSON.stringify(data, null, 2));

      return NextResponse.json(data);
    }
  } catch (error) {
    console.error("Perplexity API error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
