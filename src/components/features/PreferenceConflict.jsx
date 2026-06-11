import React, { useEffect, useState } from 'react'
import { analyzePreferenceConflict } from '@/lib/ai/preferenceConflict'
import { AlertTriangle } from 'lucide-react'

export default function PreferenceConflict({ client, availableMatches }) {
  const [warning, setWarning] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    analyzePreferenceConflict(client, availableMatches.length).then(conflictAnalysis => {
      if (isMounted) {
        if (conflictAnalysis !== 'OK' && conflictAnalysis.length > 5) {
          setWarning(conflictAnalysis)
        }
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [client, availableMatches])

  if (loading || !warning) return null

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-6 flex gap-3">
      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
      <div>
        <h4 className="text-sm font-bold text-amber-500 mb-1">Restrictive Preferences</h4>
        <p className="text-sm text-amber-200/90 leading-relaxed">
          {warning}
        </p>
      </div>
    </div>
  )
}
