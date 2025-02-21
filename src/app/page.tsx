// src/app/page.tsx
"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUpload } from "@/components/FileUpload";
import ScoreCard from "@/components/ScoreCard";

interface Section {
  title: string;
  score: number;
  feedback: string;
}

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([
    {
      title: "Problem Area",
      score: 8.5,
      feedback:
        "The problem statement is well-defined and its significance is clearly articulated. Consider adding more quantitative data to strengthen the impact assessment.",
    },
    {
      title: "Strategy",
      score: 7.8,
      feedback:
        "The proposed solution is feasible and generally well-supported. Adding more specific case studies or pilot results would enhance credibility.",
    },
    {
      title: "Roadmap",
      score: 6.5,
      feedback:
        "Timeline and milestones are present but could be more detailed. Consider breaking down larger phases into specific actionable steps.",
    },
    {
      title: "Open Issues",
      score: 7.2,
      feedback:
        "Key risks are identified, but mitigation strategies could be more specific. Consider adding a risk assessment matrix.",
    },
    {
      title: "Appendix",
      score: 7.4,
      feedback:
        "Supporting materials are relevant but could be better organized. Consider adding an executive summary of key data points.",
    },
  ]);

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    setLoading(true);
    // Here you would typically make an API call to process the PDF
    // For now, we're just simulating with the static data
    setTimeout(() => setLoading(false), 2000);
  };

  const overallScore =
    sections.reduce((acc, section) => acc + section.score, 0) / sections.length;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Proposal Critique Test</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Upload your funding proposal for an AI-powered analysis and receive
          detailed feedback to enhance its effectiveness.
        </p>
      </div>

      <FileUpload onFileSelect={handleFileSelect} maxSize={10 * 1024 * 1024} />

      {loading ? (
        <Card className="p-8">
          <div className="flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Analyzing your proposal...</span>
          </div>
        </Card>
      ) : (
        file && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-2">Overall Score</h2>
              <div className="text-3xl font-bold text-primary">
                {overallScore.toFixed(1)}/10
              </div>
            </Card>

            <div className="grid gap-4">
              {sections.map((section) => (
                <ScoreCard
                  key={section.title}
                  dimension={section.title}
                  score={section.score}
                  feedback={section.feedback}
                />
              ))}
            </div>
          </div>
        )
      )}
    </div>
  );
}
