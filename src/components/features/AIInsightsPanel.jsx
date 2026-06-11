import React, { useEffect, useState } from 'react'
import { getProfileInsights } from '@/lib/ai/profileInsights'
import { Sparkles } from 'lucide-react'

export default function AIInsightsPanel({ profile }) {
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getProfileInsights(profile).then(insights => {
      if (isMounted) {
        setTags(insights)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [profile])

  if (loading) {
    return (
      <div className="animate-pulse flex gap-2">
        <div className="h-6 w-24 bg-brand-900/20 rounded-full"></div>
        <div className="h-6 w-20 bg-brand-900/20 rounded-full"></div>
      </div>
    )
  }

  if (tags.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 mt-3">
      <div className="flex items-center gap-1.5 mr-1">
        <Sparkles className="w-3.5 h-3.5 text-brand-400" />
        <span style={{ fontFamily: 'var(--font-body)' }} className="text-[10px] uppercase font-bold tracking-wider text-brand-400/80">AI Tags:</span>
      </div>
      {tags.map((tag, i) => (
        <span key={i} style={{ fontFamily: 'var(--font-body)', color: '#f5eddc' }} className="px-2.5 py-1 text-xs font-medium bg-brand-500/10 border border-brand-500/30 rounded-full backdrop-blur-sm">
          {tag}
        </span>
      ))}
    </div>
  )
}
