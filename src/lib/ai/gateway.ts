import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";

const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "openai/gpt-4o-mini";

/**
 * Resolve a model string to a Vercel AI SDK provider instance.
 *
 * Supports OpenAI, Anthropic, and Google models via the AI SDK's
 * unified interface — the "gateway" pattern from the PRD.
 */
function resolveGateway(modelId: string) {
  if (modelId.startsWith("claude-sonnet-4")) {
    return gateway("anthropic/claude-sonnet-4");
  }
  if (modelId.startsWith("gemini-2.0-flash")) {
    return gateway("google/gemini-2.0-flash");
  }
  if (modelId.startsWith("gpt-4o-mini")) {
    return gateway("openai/gpt-4o-mini");
  }
  // Default to OpenAI for any unrecognized models
  return gateway("openai/gpt-4o");
}

/**
 * Single unified text generation call.
 * All LLM interactions in the system go through this function.
 */
export async function generate(
  prompt: string,
  modelId?: string,
): Promise<string> {
  const gateway = resolveGateway(modelId || DEFAULT_MODEL);

  const { text } = await generateText({
    model: gateway,
    prompt,
  });

  return text;
}

export { DEFAULT_MODEL };
