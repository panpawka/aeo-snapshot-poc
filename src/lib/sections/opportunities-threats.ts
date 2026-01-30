import type { Section } from "./types";

interface OpportunitiesThreatsData {
  opportunities: { point: string; explanation: string }[];
  threats: { point: string; explanation: string }[];
  outlook: string;
}

export const opportunitiesThreats: Section<OpportunitiesThreatsData> = {
  id: "opportunities_threats",
  title: "Opportunities & Threats",

  prompt(brandName: string) {
    return `You are an AI answer engine analyst. Identify forward-looking opportunities and threats for the brand "${brandName}" as an AI system would project them in a SWOT-style analysis.

Respond ONLY with valid JSON in this exact format (no markdown, no explanation outside the JSON):
{
  "opportunities": [
    { "point": "<opportunity>", "explanation": "<why this is an opportunity>" },
    { "point": "<opportunity>", "explanation": "<why this is an opportunity>" },
    { "point": "<opportunity>", "explanation": "<why this is an opportunity>" }
  ],
  "threats": [
    { "point": "<threat>", "explanation": "<why this is a threat>" },
    { "point": "<threat>", "explanation": "<why this is a threat>" },
    { "point": "<threat>", "explanation": "<why this is a threat>" }
  ],
  "outlook": "<1-2 sentence forward-looking assessment>"
}`;
  },

  parse(response: string): OpportunitiesThreatsData {
    return JSON.parse(response);
  },
};
