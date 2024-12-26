import { NextResponse } from "next/server";
import { VectorStore } from "@/libs/ai/vectorStore";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const vectorStore = new VectorStore();
    const results = await vectorStore.findRelevantContext(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Vector search error:", error);
    return NextResponse.json(
      { error: "Failed to search vector store" },
      { status: 500 }
    );
  }
}
