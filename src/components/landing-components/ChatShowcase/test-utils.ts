import type { Message } from "@/types/chat";

export const TEST_CASES = [
  {
    input: "Hello",
    expectedTrigger: "greeting",
  },
  {
    input: "Create a form",
    expectedTrigger: "create_form",
  },
];

export async function runTests(
  handleMessage: (message: Message) => Promise<void>
): Promise<Array<{ case: string; result: string }>> {
  const results = [];

  for (const testCase of TEST_CASES) {
    try {
      await handleMessage({
        role: "user",
        content: testCase.input,
      });
      results.push({
        case: testCase.input,
        result: "✅ Message handled successfully",
      });
    } catch (error) {
      results.push({
        case: testCase.input,
        result: `❌ Error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    }
  }

  return results;
}

export function formatTestResults(
  results: Array<{ case: string; result: string }>
): string {
  return results
    .map(({ case: testCase, result }) => `${testCase}: ${result}`)
    .join("\n");
}
