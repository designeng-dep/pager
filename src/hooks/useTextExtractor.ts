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
    const extractSection = (
      startTitle: string,
      middleDescription: string,
      endTitle: string
    ): string => {
      const startIndex = text.indexOf(startTitle);
      if (startIndex === -1) return "";

      const endIndex = text.indexOf(endTitle, startIndex);

      // Get the initial section from start title
      let sectionText =
        endIndex === -1
          ? text.slice(startIndex + startTitle.length).trim()
          : text.slice(startIndex + startTitle.length, endIndex).trim();

      // Look for middle description within the extracted section
      const middleIndex = sectionText.indexOf(middleDescription);
      if (middleIndex !== -1) {
        // If middle description found, only take text after it
        sectionText = sectionText
          .slice(middleIndex + middleDescription.length)
          .trim();
      }

      return sectionText;
    };

    return {
      definitionAndSize: extractSection(
        "Definition and size of problem",
        "6 hours per week wasted on manual work)",
        "Measurable outcomes"
      ),
      measurableOutcomes: extractSection(
        "Measurable outcomes",
        "Show your cost per impact 1 .",
        "Proposed solution and specific risk mitigation"
      ),
      proposedSolution: extractSection(
        "Proposed solution and specific risk mitigation",
        "Explain clearly how you intend to mitigate these risks during the POV.",
        "Validation of previous Proof-Of-Concepts done"
      ),
      validation: extractSection(
        "Validation of previous Proof-Of-Concepts done",
        "assess that the key risks are mitigated accordingly?",
        "Resourcing Table 1: Cost breakdown table"
      ),
    };
  }, []);

  return { extractSections };
};
