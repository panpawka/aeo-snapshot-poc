import { z } from "zod";
import type { Section } from "./types";

const schema = z.object({
  opportunities: z.array(
    z.object({ point: z.string(), explanation: z.string() }),
  ),
  threats: z.array(z.object({ point: z.string(), explanation: z.string() })),
  outlook: z.string(),
  reasoning: z.string(),
});

type OpportunitiesThreatsData = z.infer<typeof schema>;

export const opportunitiesThreats: Section<OpportunitiesThreatsData> = {
  id: "opportunities_threats",
  title: "Opportunities & Threats",

  prompt(brandName: string) {
    return `Identify forward-looking opportunities and threats for the brand "${brandName}" as an AI system would project them in a SWOT-style analysis.`;
  },

  schema,
};
