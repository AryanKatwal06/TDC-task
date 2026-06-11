import React, { useEffect, useState } from 'react'
import { detectHiddenGem } from '@/lib/ai/hiddenGemDetector'
import { Gem } from 'lucide-react'

export default function HiddenGemBadge({ score, breakdown }) {
  const [isGem, setIsGem] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (score >= 80) {
      setIsGem(false)
      setLoading(false)
      return
    }

    let isMounted = true
    detectHiddenGem(score, breakdown).then(res => {
      if (isMounted) {
        setIsGem(res.isGem)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [score, breakdown])

  if (loading || !isGem) return null

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border bg-purple-500/10 text-purple-400 border-purple-500/30">
      <Gem className="w-3.5 h-3.5" />
      Hidden Gem
    </div>
  )
}
