// src/app/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";
import { usePDFJS } from "@/hooks/usePDFJS";
import { useOpenAI } from "@/hooks/useOpenAI";
import { useTextExtractor, ExtractedSections } from "@/hooks/useTextExtractor";

interface Section {
  title: string;
  score: number;
  feedback: string;
}

export default function Page() {
  const { extractText, pdfContent } = usePDFJS();
  const { analyzeText } = useOpenAI();
  const { extractSections } = useTextExtractor();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAIResponse] = useState("");
  const [extractedSections, setExtractedSections] =
    useState<ExtractedSections | null>(null);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    try {
      const extractedText = await extractText(selectedFile);

      const sections = extractSections(extractedText);
      setExtractedSections(sections);

      const response = await analyzeText(extractedText);
      if (response) {
        setAIResponse(response);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      setError("Failed to process the file");
    } finally {
      setLoading(false);
    }
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

      {aiResponse && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">AI Analysis</h2>
          <p className="whitespace-pre-wrap">{aiResponse}</p>
        </div>
      )}

      {pdfContent && (
        <div className="mt-8 p-4 bg-white rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">PDF Content</h2>
          <p className="whitespace-pre-wrap">{pdfContent}</p>
        </div>
      )}

      {extractedSections && (
        <div className="mt-8 space-y-6">
          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Definition and Size of Problem
            </h2>
            <p className="whitespace-pre-wrap">
              {extractedSections.definitionAndSize}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">Measurable Outcomes</h2>
            <p className="whitespace-pre-wrap">
              {extractedSections.measurableOutcomes}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Proposed Solution and Risk Mitigation
            </h2>
            <p className="whitespace-pre-wrap">
              {extractedSections.proposedSolution}
            </p>
          </div>

          <div className="rounded-lg border border-gray-200 p-6">
            <h2 className="mb-4 text-xl font-semibold">
              Validation of Previous POCs
            </h2>
            <p className="whitespace-pre-wrap">
              {extractedSections.validation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
