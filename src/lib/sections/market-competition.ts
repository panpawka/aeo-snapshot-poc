import { z } from "zod";
import type { Section } from "./types";

const schema = z.object({
  score: z.number(),
  position: z.enum(["leader", "challenger", "niche", "emerging"]),
  competitors: z.array(z.string()),
  shareOfVoice: z.string(),
  reasoning: z.string(),
});

type MarketCompetitionData = z.infer<typeof schema>;

export const marketCompetition: Section<MarketCompetitionData> = {
  id: "market_competition",
  title: "Market Competition",

  prompt(brandName: string) {
    return `Evaluate the competitive positioning and share-of-voice narrative for the brand "${brandName}". Return 'position' as lowercase: leader, challenger, niche, emerging. Return 'score' as a number between 1 and 10.`;
  },

  schema,
};
