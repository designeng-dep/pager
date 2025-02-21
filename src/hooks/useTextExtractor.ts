import { useCallback } from "react";

export interface ExtractedSections {
  definitionAndSize: string;
  measurableOutcomes: string;
  proposedSolution: string;
  validation: string;
}

export type SectionKeys = keyof ExtractedSections;

export const useTextExtractor = () => {
  const extractSections = useCallback((text: string): ExtractedSections => {
    const extractSection = (startTitle: string, endTitle: string): string => {
      const startIndex = text.indexOf(startTitle);
      if (startIndex === -1) return "";

      const endIndex = text.indexOf(endTitle, startIndex);
      if (endIndex === -1) {
        // If no end title found, extract until the end of text
        return text.slice(startIndex + startTitle.length).trim();
      }

      return text.slice(startIndex + startTitle.length, endIndex).trim();
    };

    return {
      definitionAndSize: extractSection(
        "Definition and size of problem",
        "Measurable outcomes"
      ),
      measurableOutcomes: extractSection(
        "Measurable outcomes",
        "Proposed solution and specific risk mitigation"
      ),
      proposedSolution: extractSection(
        "Proposed solution and specific risk mitigation",
        "Validation of previous Proof-Of-Concepts done"
      ),
      validation: extractSection(
        "Validation of previous Proof-Of-Concepts done",
        // Since this is the last section, we don't need an end title
        "[END_OF_DOCUMENT]"
      ),
    };
  }, []);

  return { extractSections };
};
