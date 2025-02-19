import { Card } from '@/components/ui/card'

interface ScoreSummaryProps {
  score: number
}

export function ScoreSummary({ score }: ScoreSummaryProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-600'
    if (score >= 6) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Overall Score</h2>
          <p className="text-sm text-muted-foreground">Based on 5 key dimensions</p>
        </div>
        <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
          {score.toFixed(1)}/10
        </div>
      </div>
    </Card>
  )
} 