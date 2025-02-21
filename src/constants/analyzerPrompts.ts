import { SectionKeys } from "@/hooks/useTextExtractor";

export const analyzerPrompts: Record<SectionKeys, string> = {
  definitionAndSize: "",
  measurableOutcomes: "",
  proposedSolution: "",
  validation: "",
} as const;

// Type for the prompts object
export type AnalyzerPromptKey = keyof typeof analyzerPrompts;
