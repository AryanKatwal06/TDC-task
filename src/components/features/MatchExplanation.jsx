import React from 'react'
import { CheckCircle2, AlertTriangle, Info } from 'lucide-react'

export default function MatchExplanation({ matchResult }) {
  const { strengths, concerns, headline, breakdown } = matchResult

  // We sort by weight, not raw score, so the matchmaker sees the most impactful dimensions at the top of the chart.
  const sortedDimensions = Object.entries(breakdown)
    .sort(([, a], [, b]) => b.weight - a.weight)

  return (
    <div className="mt-4 border-t border-surface-200 pt-4 animate-in fade-in slide-in-from-top-4 duration-300">
      

      <div className="flex items-start gap-3 mb-6 bg-brand-50 p-4 rounded-lg border border-brand-100">
        <Info className="w-5 h-5 text-brand flex-shrink-0 mt-0.5" />
        <p className="text-sm font-medium text-brand-900 leading-relaxed">
          {headline}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        

        <div className="space-y-6">
          <div>
            <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-3">
              Key Strengths
            </h4>
            <ul className="space-y-3">
              {strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-surface-700">
                  <CheckCircle2 className="w-4 h-4 text-jade flex-shrink-0 mt-0.5" />
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          </div>

          {concerns.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-3">
                Points of Consideration
              </h4>
              <ul className="space-y-3">
                {concerns.map((con, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-surface-700">
                    <AlertTriangle className="w-4 h-4 text-amber flex-shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>


        <div>
          <h4 className="text-xs font-bold text-surface-400 uppercase tracking-wider mb-3">
            Compatibility Breakdown
          </h4>
          <div className="space-y-3 bg-surface-50 p-4 rounded-lg border border-surface-200">
            {sortedDimensions.map(([key, data]) => {

              let barColor = 'bg-brand'
              if (data.score >= 80) barColor = 'bg-jade'
              else if (data.score < 50) barColor = 'bg-crimson'
              else if (data.score < 65) barColor = 'bg-amber'

              return (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-32 text-xs font-medium text-surface-600 truncate" title={data.label}>
                    {data.label}
                  </div>
                  <div className="flex-1 h-2 bg-surface-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${barColor} transition-all duration-1000 ease-out`}
                      style={{ width: `${data.score}%` }}
                    />
                  </div>
                  <div className="w-8 text-right text-xs font-semibold text-surface-900">
                    {data.score}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  )
}
