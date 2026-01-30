import type { SectionResult } from "@/lib/sections/types";

/**
 * The complete AEO snapshot — metadata + per-section results.
 */
export interface Snapshot {
  brand: string;
  model: string;
  generatedAt: string;
  sections: Record<string, SectionResult>;
}

/**
 * Input for generating a snapshot.
 */
export interface SnapshotRequest {
  brandName: string;
  enabledSections?: string[];
  model?: string;
}
