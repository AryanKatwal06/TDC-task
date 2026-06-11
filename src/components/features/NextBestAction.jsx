import React, { useEffect, useState } from 'react'
import { getNextBestAction } from '@/lib/ai/nextBestAction'
import { Zap } from 'lucide-react'

export default function NextBestAction({ client, matches }) {
  const [action, setAction] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getNextBestAction(client, matches).then(recommendedAction => {
      if (isMounted) {
        setAction(recommendedAction)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [client, matches])

  return (
    <div className="border border-brand-500/30 rounded-xl p-4 mb-6 relative overflow-hidden" style={{ background: 'linear-gradient(to right, rgba(85,52,26,0.2), #111111)' }}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex items-start gap-3">
        <div className="mt-0.5 bg-brand-500 p-1.5 rounded-lg text-[#111111]">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <h4 style={{ fontFamily: 'var(--font-body)' }} className="text-xs font-bold text-brand-400 uppercase tracking-wider mb-1">AI Next Best Action</h4>
          {loading ? (
            <div className="h-4 bg-brand-900/20 rounded w-48 animate-pulse mt-1"></div>
          ) : (
            <p style={{ fontFamily: 'var(--font-body)', color: '#f5eddc' }} className="text-sm font-medium">
              {action || "Awaiting further activity"}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
