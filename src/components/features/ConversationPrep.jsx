import React, { useEffect, useState } from 'react'
import { getConversationPrep } from '@/lib/ai/conversationPrep'
import { MessageSquareText, Sparkles } from 'lucide-react'

// Simple helper to parse Markdown bolding (**text**)
function parseMarkdown(text) {
  const parts = text.split(/(\*\*.*?\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-medium text-brand-300 tracking-wide">
          {part.slice(2, -2)}
        </strong>
      )
    }
    return part
  })
}

export default function ConversationPrep({ client }) {
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    getConversationPrep(client).then(prepNotes => {
      if (isMounted) {
        setNotes(prepNotes)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [client])

  if (loading || !notes || notes.length === 0) return null

  return (
    <div className="relative overflow-hidden border border-brand-500/20 rounded-2xl p-6 shadow-md mb-8 group transition-all duration-300 hover:border-brand-500/40 hover:shadow-lg hover:shadow-brand-500/5" style={{ background: 'linear-gradient(to bottom right, #1a1814, #111111)' }}>
      {/* Subtle background glow effect */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-brand-500/10 rounded-full blur-3xl -z-10 group-hover:bg-brand-500/15 transition-colors duration-500 pointer-events-none" />
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 border-b border-brand-500/10 pb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 shadow-inner">
          <MessageSquareText className="w-4 h-4 text-brand-400" />
        </div>
        <h4 style={{ fontFamily: 'var(--font-body)' }} className="text-sm font-bold text-brand-300 uppercase tracking-widest">
          AI Meeting Prep
        </h4>
      </div>
      
      {/* Bullet Points */}
      <ul className="space-y-4">
        {notes.map((note, i) => (
          <li key={i} style={{ fontFamily: 'var(--font-body)', color: 'rgba(245,237,220,0.85)' }} className="text-[15px] leading-relaxed flex items-start gap-4">
            <div className="mt-1 flex-shrink-0 w-5 h-5 flex items-center justify-center bg-[#111111] rounded-full border border-brand-500/30">
              <Sparkles className="w-3 h-3 text-brand-400 opacity-80" />
            </div>
            <span className="font-light tracking-wide">{parseMarkdown(note)}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}