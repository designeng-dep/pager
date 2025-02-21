// src/app/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { FileUpload } from "@/components/FileUpload";
import { usePDFJS } from "@/hooks/usePDFJS";
import { useOpenAI } from "@/hooks/useOpenAI";
import {
  useTextExtractor,
  ExtractedSections,
  SectionKeys,
} from "@/hooks/useTextExtractor";
import { analyzerPrompts } from "@/constants/analyzerPrompts";
import ReactMarkdown from "react-markdown";

export default function Page() {
  const { extractText, pdfContent } = usePDFJS();
  const { analyzeText } = useOpenAI();
  const { extractSections } = useTextExtractor();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponses, setAiResponses] = useState<Record<SectionKeys, string>>({
    definitionAndSize: "",
    measurableOutcomes: "",
    proposedSolution: "",
    validation: "",
  });
  const [extractedSections, setExtractedSections] =
    useState<ExtractedSections | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    setError(null);

    try {
      const extractedText = await extractText(selectedFile);
      const sections = extractSections(extractedText);
      setExtractedSections(sections);

      // Process each section with its corresponding prompt
      const analysisPromises = Object.entries(sections).map(
        async ([key, content]) => {
          const prompt = analyzerPrompts[key as keyof ExtractedSections];
          const response = await analyzeText(content, prompt);
          return { key, response };
        }
      );

      const results = await Promise.all(analysisPromises);

      const newResponses = results.reduce(
        (acc, { key, response }) => ({
          ...acc,
          [key]: response || "",
        }),
        {} as Record<keyof ExtractedSections, string>
      );

      setAiResponses(newResponses);
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Failed to process the file");
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysisAndContent = () => {
    const sections = [
      {
        key: "definitionAndSize",
        title: "Definition and Size of Problem",
      },
      {
        key: "measurableOutcomes",
        title: "Measurable Outcomes",
      },
      {
        key: "proposedSolution",
        title: "Proposed Solution and Risk Mitigation",
      },
      {
        key: "validation",
        title: "Validation of Previous POCs",
      },
    ];

    return sections.map(({ key, title }) => (
      <div key={key} className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* AI Analysis Column */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">AI Analysis: {title}</h2>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown>{aiResponses[key as SectionKeys]}</ReactMarkdown>
          </div>
        </div>

        {/* Original Content Column */}
        <div className="rounded-lg border border-gray-200 p-4">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p className="whitespace-pre-wrap">
            {extractedSections?.[key as SectionKeys]}
          </p>
        </div>
      </div>
    ));
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Proposal Critique</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your funding proposal for an AI-powered analysis and receive
          detailed feedback to enhance its effectiveness.
        </p>
      </div>

      <FileUpload onFileSelect={handleFileSelect} maxSize={10 * 1024 * 1024} />

      {loading && (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Analyzing your proposal...</span>
          </div>
        </Card>
      )}

      {extractedSections && renderAnalysisAndContent()}

      {pdfContent && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">PDF Content</h2>
          <p className="whitespace-pre-wrap">{pdfContent}</p>
        </div>
      )}
    </div>
  );
}
