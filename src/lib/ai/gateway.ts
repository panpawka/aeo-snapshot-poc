import { generateText, Output } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";

const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "openai/gpt-4o-mini";

export { DEFAULT_MODEL };

/**
 * Resolve a model string to a Vercel AI SDK provider instance.
 *
 * Supports OpenAI, Anthropic, and Google models via the AI SDK's
 * unified interface — the "gateway" pattern from the PRD.
 */
function resolveGateway(modelId: string) {
  if (modelId.startsWith("claude-haiku-4.5")) {
    return gateway("anthropic/claude-haiku-4.5");
  }
  if (modelId.startsWith("sonar")) {
    return gateway("perplexity/sonar");
  }
  if (modelId.startsWith("gemini-3-flash")) {
    return gateway("google/gemini-3-flash");
  }
  if (modelId.startsWith("gpt-4o-mini")) {
    return gateway("openai/gpt-4o-mini");
  }
  // Default to OpenAI for any unrecognized models
  return gateway("openai/gpt-4o-mini");
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

/**
 * Generate structured data matching a Zod schema.
 */
export async function generateStructured<T>(
  prompt: string,
  schema: z.ZodType<T>,
  modelId?: string,
): Promise<T> {
  const gateway = resolveGateway(modelId || DEFAULT_MODEL);

  const result = await generateText({
    model: gateway,
    prompt,
    output: Output.object({
      schema,
    }),
  });

  return result.output;
}
