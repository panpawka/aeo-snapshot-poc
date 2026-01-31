import { z } from "zod";
import type { Section } from "./types";

const schema = z.object({
  strengths: z.array(z.object({ point: z.string(), explanation: z.string() })),
  weaknesses: z.array(z.object({ point: z.string(), explanation: z.string() })),
  summary: z.string(),
});

type StrengthsWeaknessesData = z.infer<typeof schema>;

export const strengthsWeaknesses: Section<StrengthsWeaknessesData> = {
  id: "strengths_weaknesses",
  title: "Strengths & Weaknesses",

  prompt(brandName: string) {
    return `Identify the perceived strengths and weaknesses of the brand "${brandName}" as an AI system would present them.`;
  },

  schema,
};
