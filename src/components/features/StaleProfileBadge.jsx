import React from 'react'
import { isStaleProfile } from '@/services/matching/staleDetectorUtil'
import { Clock } from 'lucide-react'

export default function StaleProfileBadge({ client }) {
  if (!isStaleProfile(client)) return null

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/15 text-red-400 border border-red-500/25">
      <Clock className="w-3 h-3" />
      Stale — No activity 14+ days
    </span>
  )
}
