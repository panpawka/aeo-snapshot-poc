import type { Section } from "./types";

interface SentimentData {
  score: number;
  overall: string;
  positiveDrivers: string[];
  negativeDrivers: string[];
  reasoning: string;
}

export const sentiment: Section<SentimentData> = {
  id: "sentiment",
  title: "Sentiment Analysis",

  prompt(brandName: string) {
    return `You are an AI answer engine analyst. Evaluate the overall sentiment and key sentiment drivers for the brand "${brandName}" as an AI system would perceive them.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside the JSON):
{
  "score": <number 1-10>,
  "overall": "<positive | neutral | mixed | negative>",
  "positiveDrivers": ["<driver 1>", "<driver 2>"],
  "negativeDrivers": ["<driver 1>", "<driver 2>"],
  "reasoning": "<2-3 sentence explanation of sentiment assessment>"
}`;
  },

  parse(response: string): SentimentData {
    return JSON.parse(response);
  },
};
