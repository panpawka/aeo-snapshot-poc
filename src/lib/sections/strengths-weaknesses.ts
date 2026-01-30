import type { Section } from "./types";

interface StrengthsWeaknessesData {
  strengths: { point: string; explanation: string }[];
  weaknesses: { point: string; explanation: string }[];
  summary: string;
}

export const strengthsWeaknesses: Section<StrengthsWeaknessesData> = {
  id: "strengths_weaknesses",
  title: "Strengths & Weaknesses",

  prompt(brandName: string) {
    return `You are an AI answer engine analyst. Identify the perceived strengths and weaknesses of the brand "${brandName}" as an AI system would present them.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside the JSON):
{
  "strengths": [
    { "point": "<strength>", "explanation": "<why this is a strength>" },
    { "point": "<strength>", "explanation": "<why this is a strength>" },
    { "point": "<strength>", "explanation": "<why this is a strength>" }
  ],
  "weaknesses": [
    { "point": "<weakness>", "explanation": "<why this is a weakness>" },
    { "point": "<weakness>", "explanation": "<why this is a weakness>" },
    { "point": "<weakness>", "explanation": "<why this is a weakness>" }
  ],
  "summary": "<1-2 sentence overall assessment>"
}`;
  },

  parse(response: string): StrengthsWeaknessesData {
    return JSON.parse(response);
  },
};
