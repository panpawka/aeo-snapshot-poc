import type { Section } from "./types";

interface MarketCompetitionData {
  score: number;
  position: string;
  competitors: string[];
  shareOfVoice: string;
  reasoning: string;
}

export const marketCompetition: Section<MarketCompetitionData> = {
  id: "market_competition",
  title: "Market Competition",

  prompt(brandName: string) {
    return `You are an AI answer engine analyst. Evaluate the competitive positioning and share-of-voice narrative for the brand "${brandName}".

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside the JSON):
{
  "score": <number 1-10>,
  "position": "<leader | challenger | niche | emerging>",
  "competitors": ["<competitor 1>", "<competitor 2>", "<competitor 3>"],
  "shareOfVoice": "<2-3 sentence assessment of how often this brand appears in AI-generated answers relative to competitors>",
  "reasoning": "<2-3 sentence explanation of competitive positioning>"
}`;
  },

  parse(response: string): MarketCompetitionData {
    return JSON.parse(response);
  },
};
