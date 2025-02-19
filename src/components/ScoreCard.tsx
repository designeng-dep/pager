'use client'

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface ScoreCardProps {
  dimension: string
  score: number
  feedback: string
  className?: string
}

export default function ScoreCard({ dimension, score, feedback, className }: ScoreCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [userRevision, setUserRevision] = useState("")

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600"
    if (score >= 6) return "text-yellow-600"
    return "text-red-600"
  }

  return (
    <div
      className={cn(
        "p-6 rounded-lg bg-card border transition-all duration-200",
        isExpanded ? "shadow-md" : "hover:shadow-sm",
        className
      )}
    >
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">{dimension}</h3>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
          <span className={cn("text-2xl font-bold", getScoreColor(score))}>
            {score}/10
          </span>
        </div>
        <p className="text-muted-foreground">{feedback}</p>
      </button>

      {isExpanded && (
        <div className="mt-6 space-y-4 animate-in fade-in-50">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Original Text
            </h4>
            <div className="p-4 bg-muted/50 rounded-lg text-sm">
              <p className="text-muted-foreground">
                [Original text from your PDF will appear here]
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              AI Suggestions
            </h4>
            <div className="p-4 bg-primary/5 rounded-lg text-sm space-y-2">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Add quantitative metrics to support your claims</li>
                <li>Include specific examples from similar successful projects</li>
                <li>Consider addressing potential counterarguments</li>
              </ul>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm text-muted-foreground">
              Your Revision
            </h4>
            <Textarea
              value={userRevision}
              onChange={(e) => setUserRevision(e.target.value)}
              placeholder="Type your revised text here..."
              className="min-h-[120px] resize-y"
            />
          </div>
        </div>
      )}
    </div>
  )
} 