import { getBaseUrl } from "@/lib/utils";

export interface PerplexityResponse {
  text: string;
  references?: Array<{
    title: string;
    url: string;
    snippet: string;
  }>;
}

export async function searchPerplexity(
  query: string
): Promise<PerplexityResponse> {
  const baseUrl = getBaseUrl();
  const response = await fetch(`${baseUrl}/api/perplexity`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch from Perplexity");
  }

  return response.json();
}
