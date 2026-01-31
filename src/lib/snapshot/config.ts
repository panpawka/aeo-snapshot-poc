export const SECTION_CONFIG: Record<
  string,
  {
    label: string;
    fields: Record<
      string,
      {
        label: string;
        type: "text" | "progress" | "list" | "complex_list";
        max?: number;
      }
    >;
  }
> = {
  brand_recognition: {
    label: "Brand Recognition",
    fields: {
      score: { label: "Recognition Score", type: "progress", max: 10 },
      visibility: { label: "Visibility", type: "text" },
      keyFactors: { label: "Key Factors", type: "list" },
      reasoning: { label: "AI Analysis", type: "text" },
    },
  },
  market_competition: {
    label: "Market Competition",
    fields: {
      score: { label: "Market Score", type: "progress", max: 10 },
      position: { label: "Market Position", type: "text" },
      shareOfVoice: { label: "Share of Voice", type: "text" },
      competitors: { label: "Key Competitors", type: "list" },
      reasoning: { label: "Strategic Analysis", type: "text" },
    },
  },
  sentiment: {
    label: "Sentiment Analysis",
    fields: {
      score: { label: "Sentiment Score", type: "progress", max: 10 },
      overall: { label: "Overall Sentiment", type: "text" },
      positiveDrivers: { label: "Positive Drivers", type: "list" },
      negativeDrivers: { label: "Negative Drivers", type: "list" },
      reasoning: { label: "Contextual Analysis", type: "text" },
    },
  },
  strengths_weaknesses: {
    label: "Strengths & Weaknesses",
    fields: {
      summary: { label: "Executive Summary", type: "text" },
      strengths: { label: "Key Strengths", type: "complex_list" },
      weaknesses: { label: "Areas for Improvement", type: "complex_list" },
    },
  },
  opportunities_threats: {
    label: "Opportunities & Threats",
    fields: {
      outlook: { label: "Strategic Outlook", type: "text" },
      opportunities: { label: "Opportunities", type: "complex_list" },
      threats: { label: "Threats", type: "complex_list" },
    },
  },
};
