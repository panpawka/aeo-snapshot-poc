import type { Section, SectionResult } from "@/lib/sections/types";
import type { Snapshot, SnapshotRequest } from "./types";
import { resolveSections } from "@/lib/sections";
import { generate, DEFAULT_MODEL } from "@/lib/ai/gateway";

/**
 * Execute a single section — isolates failures so one bad section
 * doesn't take down the whole snapshot.
 */
async function executeSection(
  section: Section,
  brandName: string,
  model?: string
): Promise<SectionResult> {
  try {
    const prompt = section.prompt(brandName);
    const raw = await generate(prompt, model);
    const data = section.parse(raw);
    return { status: "success", data };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[section:${section.id}] Failed: ${message}`);
    return { status: "error", error: message };
  }
}

/**
 * Generate a complete AEO snapshot.
 *
 * Runs all enabled sections in parallel (one LLM call per section,
 * no shared context) and assembles the results.
 */
export async function generateSnapshot(
  request: SnapshotRequest
): Promise<Snapshot> {
  const { brandName, enabledSections, model } = request;
  const resolvedModel = model || DEFAULT_MODEL;
  const sections = resolveSections(enabledSections);

  const results = await Promise.all(
    sections.map(async (section) => ({
      id: section.id,
      result: await executeSection(section, brandName, resolvedModel),
    }))
  );

  const sectionResults: Record<string, SectionResult> = {};
  for (const { id, result } of results) {
    sectionResults[id] = result;
  }

  return {
    brand: brandName,
    model: resolvedModel,
    generatedAt: new Date().toISOString(),
    sections: sectionResults,
  };
}
