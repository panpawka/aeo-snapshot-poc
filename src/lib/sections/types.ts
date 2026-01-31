import { z } from "zod";

/**
 * Core section interface — every AEO report section implements this.
 *
 * Each section is independently definable, executable, and removable
 * without modifying orchestration logic.
 */
export interface Section<T = unknown> {
  /** Unique identifier (e.g. "brand_recognition") */
  id: string;

  /** Human-readable display name */
  title: string;

  /** Generates a self-contained prompt for the LLM — no shared context */
  prompt(brandName: string): string;

  /** Zod schema to enforce structured output */
  schema: z.ZodType<T>;
}

/**
 * Result of executing a single section — either success or failure.
 * Failures are isolated and do not block other sections.
 */
export type SectionResult<T = unknown> =
  | { status: "success"; data: T }
  | { status: "error"; error: string };
