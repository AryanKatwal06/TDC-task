import React, { useState, useEffect } from 'react'
import { getCommandCenterSummary } from '@/lib/ai/commandCenter'
import { Sparkles, Calendar, ArrowRight, UserCheck, Loader2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getPriorityQueue } from '@/services/matching/priorityQueue'
import Card from '@/components/ui/Card'

export default function CommandCenter({ clients, userName }) {
  const navigate = useNavigate()
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(true)
  
  const priorityClients = getPriorityQueue(clients)

  useEffect(() => {
    if (clients.length === 0) return
    let isMounted = true
    getCommandCenterSummary(clients).then(commandSummary => {
      if (isMounted) {
        setSummary(commandSummary)
        setLoading(false)
      }
    })
    return () => { isMounted = false }
  }, [clients])

  const suggestedActions = priorityClients.slice(0, 3).map(c => {
    if (c.statusTag === 'New') return { label: `Review ${c.personal.firstName}'s new profile`, id: c.id, icon: <UserCheck className="w-4 h-4" /> }
    return { label: `Follow up with ${c.personal.firstName}`, id: c.id, icon: <Calendar className="w-4 h-4" /> }
  })

  if (suggestedActions.length < 3 && clients.length > 0) {
    suggestedActions.push({ label: 'Check pending introductions', id: clients[0].id, icon: <ArrowRight className="w-4 h-4" /> })
  }

  return (
    <div className="mb-8 relative group" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #181613 0%, #0d0c0a 100%)', border: '1px solid rgba(220,158,74,0.2)', boxShadow: '0 12px 32px rgba(0,0,0,0.4)', overflow: 'hidden' }}>
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 rounded-full blur-[60px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 p-6 lg:p-8">
        <div>
          <h2 className="bg-clip-text text-transparent bg-gradient-to-r from-ivory-100 to-brand-300" style={{ fontFamily: 'var(--font-display)', fontSize: '2.25rem', fontWeight: 500, fontStyle: 'italic', marginBottom: '16px', lineHeight: 1.2 }}>
            Greetings, {userName}&nbsp;<span className="not-italic inline-block animate-[fadeUp_0.5s_ease_forwards] origin-bottom-right text-ivory-100">👋</span>
          </h2>
          
          <div className="relative overflow-hidden backdrop-blur-md" style={{ background: 'linear-gradient(180deg, rgba(220,158,74,0.08) 0%, rgba(220,158,74,0.02) 100%)', border: '1px solid rgba(220,158,74,0.15)', borderTop: '1px solid rgba(220,158,74,0.3)', borderRadius: '12px', padding: '20px', minHeight: '120px', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-brand-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-2 mb-4 text-brand-400">
              <Sparkles className="w-4 h-4" />
              <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>AI Briefing</h3>
            </div>
            {loading ? (
              <div className="flex items-center gap-2" style={{ color: 'rgba(245,237,220,0.6)' }}>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Analyzing pipeline...</span>
              </div>
            ) : (
              <p className="relative z-10" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', color: 'rgba(245,237,220,0.9)', lineHeight: 1.6, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                {summary || "Your pipeline is looking healthy today. Keep up the good work!"}
              </p>
            )}
          </div>
        </div>

        <div>
          <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(220,158,74,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>
            Priority Actions
          </h3>
          <div className="space-y-3">
            {suggestedActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(`/clients/${action.id}`)}
                className="w-full flex items-center justify-between transition-all text-left group/btn relative overflow-hidden"
                style={{ background: 'linear-gradient(90deg, rgba(20,18,15,0.8) 0%, rgba(26,24,20,0.8) 100%)', border: '1px solid rgba(220,158,74,0.1)', borderRadius: '12px', padding: '14px 16px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(90deg, rgba(220,158,74,0.1) 0%, rgba(26,24,20,0.9) 100%)'; e.currentTarget.style.borderColor = 'rgba(220,158,74,0.3)' }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'linear-gradient(90deg, rgba(20,18,15,0.8) 0%, rgba(26,24,20,0.8) 100%)'; e.currentTarget.style.borderColor = 'rgba(220,158,74,0.1)' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-brand-500/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="flex items-center gap-3 relative z-10">
                  <div className="text-brand-500/80 group-hover/btn:text-brand-400 transition-colors">
                    {action.icon}
                  </div>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', color: '#f5eddc', fontWeight: 500 }}>
                    {action.label}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-brand-400 opacity-0 group-hover/btn:opacity-100 transition-all -translate-x-4 group-hover/btn:translate-x-0 relative z-10" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}