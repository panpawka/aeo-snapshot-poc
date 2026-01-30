import type { Section } from "./types";

interface BrandRecognitionData {
  score: number;
  visibility: string;
  reasoning: string;
  keyFactors: string[];
}

export const brandRecognition: Section<BrandRecognitionData> = {
  id: "brand_recognition",
  title: "Brand Recognition",

  prompt(brandName: string) {
    return `You are an AI answer engine analyst. Evaluate the brand "${brandName}" for AI-perceived visibility and recognition.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside the JSON):
{
  "score": <number 1-10>,
  "visibility": "<high | medium | low>",
  "reasoning": "<2-3 sentence explanation of how AI systems would perceive this brand's recognition>",
  "keyFactors": ["<factor 1>", "<factor 2>", "<factor 3>"]
}`;
  },

  parse(response: string): BrandRecognitionData {
    return JSON.parse(response);
  },
};
