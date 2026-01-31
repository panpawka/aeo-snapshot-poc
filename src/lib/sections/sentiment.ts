import { z } from "zod";
import type { Section } from "./types";

const schema = z.object({
  score: z.number(),
  overall: z.enum(["positive", "neutral", "mixed", "negative"]),
  positiveDrivers: z.array(z.string()),
  negativeDrivers: z.array(z.string()),
  reasoning: z.string(),
});

type SentimentData = z.infer<typeof schema>;

export const sentiment: Section<SentimentData> = {
  id: "sentiment",
  title: "Sentiment Analysis",

  prompt(brandName: string) {
    return `Evaluate the overall sentiment and key sentiment drivers for the brand "${brandName}" as an AI system would perceive them. Return 'overall' as lowercase: positive, neutral, mixed, negative. Return 'score' as a number between 1 and 10.`;
  },

  schema,
};
