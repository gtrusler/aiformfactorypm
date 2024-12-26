interface EnvConfig {
  perplexityApiKey: string;
  perplexityModel: string;
  openaiApiKey: string;
  dalleModel: string;
  nodeEnv: string;
}

export function loadEnvConfig(): EnvConfig {
  // Verify required environment variables
  const requiredVars = ["PERPLEXITY_API_KEY", "OPENAI_API_KEY"];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(", ")}`
    );
  }

  return {
    perplexityApiKey: process.env.PERPLEXITY_API_KEY!,
    perplexityModel: process.env.PERPLEXITY_MODEL || "pplx-7b-online",
    openaiApiKey: process.env.OPENAI_API_KEY!,
    dalleModel: process.env.DALLE_MODEL || "dall-e-3",
    nodeEnv: process.env.NODE_ENV || "development",
  };
}

// Export a singleton instance
export const envConfig = loadEnvConfig();
