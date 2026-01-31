import { z } from "zod";
import type { Section } from "./types";

const schema = z.object({
  score: z.number(),
  visibility: z.enum(["high", "medium", "low"]),
  reasoning: z.string(),
  keyFactors: z.array(z.string()),
});

type BrandRecognitionData = z.infer<typeof schema>;

export const brandRecognition: Section<BrandRecognitionData> = {
  id: "brand_recognition",
  title: "Brand Recognition",

  prompt(brandName: string) {
    return `Evaluate the brand "${brandName}" for AI-perceived visibility and recognition. Return 'visibility' as lowercase: high, medium, low. Return 'score' as a number between 1 and 10.`;
  },

  schema,
};
