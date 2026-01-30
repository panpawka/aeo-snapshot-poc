import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";
import { google } from "@ai-sdk/google";

const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "gpt-4o";

/**
 * Resolve a model string to a Vercel AI SDK provider instance.
 *
 * Supports OpenAI, Anthropic, and Google models via the AI SDK's
 * unified interface — the "gateway" pattern from the PRD.
 */
function resolveModel(modelId: string) {
  if (modelId.startsWith("claude")) {
    return anthropic(modelId);
  }
  if (modelId.startsWith("gemini")) {
    return google(modelId);
  }
  // Default to OpenAI for gpt-* and any unrecognized models
  return openai(modelId);
}

/**
 * Single unified text generation call.
 * All LLM interactions in the system go through this function.
 */
export async function generate(
  prompt: string,
  modelId?: string
): Promise<string> {
  const model = resolveModel(modelId || DEFAULT_MODEL);

  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
}

export { DEFAULT_MODEL };
