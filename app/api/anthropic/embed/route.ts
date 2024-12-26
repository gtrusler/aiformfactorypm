import { NextResponse } from "next/server";
import OpenAI from "openai";

interface EmbeddingRequest {
  text: string;
}

export const runtime = "edge";

export async function POST(request: Request) {
  try {
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      console.error("OPENAI_API_KEY is not configured");
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log("Embedding request:", JSON.stringify(body, null, 2));

    const { text } = body as EmbeddingRequest;

    const openai = new OpenAI({ apiKey: openaiKey });
    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });

    console.log(
      "Embedding response:",
      JSON.stringify(embeddingResponse, null, 2)
    );

    return NextResponse.json({
      embedding: embeddingResponse.data[0].embedding,
      usage: embeddingResponse.usage,
    });
  } catch (error) {
    console.error("Embedding error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
