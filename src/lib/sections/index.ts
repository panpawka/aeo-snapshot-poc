import type { Section } from "./types";
import { brandRecognition } from "./brand-recognition";
import { marketCompetition } from "./market-competition";
import { sentiment } from "./sentiment";
import { strengthsWeaknesses } from "./strengths-weaknesses";
import { opportunitiesThreats } from "./opportunities-threats";

/**
 * Section registry — add new sections here.
 * No other file needs to change when adding a section.
 */
export const allSections: Section[] = [
  brandRecognition,
  marketCompetition,
  sentiment,
  strengthsWeaknesses,
  opportunitiesThreats,
];

/**
 * Resolve which sections to run.
 * If enabledIds is provided, filters to only those. Otherwise returns all.
 */
export function resolveSections(enabledIds?: string[]): Section[] {
  if (!enabledIds || enabledIds.length === 0) {
    return allSections;
  }
  return allSections.filter((s) => enabledIds.includes(s.id));
}
