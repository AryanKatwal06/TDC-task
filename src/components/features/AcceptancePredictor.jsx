import React, { useEffect, useState } from 'react'
import { predictAcceptance } from '@/lib/ai/acceptancePredictor'
import { Target } from 'lucide-react'

export default function AcceptancePredictor({ client, profile, score }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    predictAcceptance(client, profile, score).then(prediction => {
      if (isMounted) {
        setData(prediction)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [client, profile, score])

  if (loading) {
    return <div className="h-6 w-32 bg-[#111111] rounded animate-pulse"></div>
  }

  if (!data || !data.probability) return null

  const colorClass = data.probability >= 80 ? 'text-green-400' : data.probability >= 60 ? 'text-brand-400' : 'text-amber-400'
  const bgClass = data.probability >= 80 ? 'bg-green-500/10' : data.probability >= 60 ? 'bg-brand-500/10' : 'bg-amber-500/10'

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 ${bgClass} whitespace-nowrap flex-shrink-0`}>
        <Target className={`w-4 h-4 flex-shrink-0 ${colorClass}`} />
        <span style={{ fontFamily: 'var(--font-body)' }} className={`text-sm font-bold ${colorClass} whitespace-nowrap`}>{data.probability}% Acceptance Probability</span>
      </div>
      <p className="text-xs italic text-surface-500 max-w-[280px] leading-relaxed">
        {data.reason}
      </p>
    </div>
  )
}
