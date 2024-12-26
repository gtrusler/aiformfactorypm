import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

interface RunpodError {
  response: {
    data: unknown;
    status: number;
  };
}

function isRunpodError(error: unknown): error is RunpodError {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof error.response === "object" &&
    error.response !== null &&
    "data" in error.response &&
    "status" in error.response &&
    typeof error.response.status === "number"
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const response = await fetch(
      "https://api.runpod.ai/v2/stable-diffusion-v1/run",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RUNPOD_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    if (isRunpodError(error)) {
      return NextResponse.json(error.response.data, {
        status: error.response.status,
      });
    }
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
