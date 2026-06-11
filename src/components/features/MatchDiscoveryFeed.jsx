import React, { useMemo } from 'react'
import { getMatchesForClient } from '@/engine'
import { Link } from 'react-router-dom'
import { ArrowRight, Flame } from 'lucide-react'
import Card from '@/components/ui/Card'

export default function MatchDiscoveryFeed({ clients }) {
  // Mock a feed by finding the top 3 matches across the pool
  const topMatches = useMemo(() => {
    if (!clients || clients.length < 2) return []
    
    let allMatches = []
    
    // For performance, only check active clients looking for matches
    const searchers = clients.filter(c => c.statusTag === 'Active' || c.statusTag === 'New').slice(0, 5)
    
    for (const client of searchers) {
      const matches = getMatchesForClient(client, clients)
      // Pick top matches that haven't been sent yet
      const highConfidence = matches.filter(m => m.score >= 80 && !m.alreadySent)
      for (const m of highConfidence) {
        allMatches.push({
          client,
          match: m.profile,
          score: m.score,
          tier: m.tier
        })
      }
    }
    
    // Sort globally by score
    allMatches.sort((a, b) => b.score - a.score)
    
    // Deduplicate
    const seen = new Set()
    const unique = []
    for (const m of allMatches) {
      const pairId = [m.client.id, m.match.id].sort().join('-')
      if (!seen.has(pairId)) {
        seen.add(pairId)
        unique.push(m)
      }
      if (unique.length >= 3) break
    }
    
    return unique
  }, [clients])

  if (topMatches.length === 0) return null

  return (
    <div className="mb-8">
      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(220,158,74,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }} className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-brand-500" />
        New Match Discovery
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {topMatches.map((item, i) => (
          <Link 
            key={i} 
            to={`/clients/${item.client.id}`}
            className="group relative overflow-hidden block transition-all"
            style={{ background: '#111111', border: '1px solid rgba(220,158,74,0.15)', borderRadius: '16px', padding: '16px', boxShadow: '0 8px 24px rgba(26,24,20,0.1)' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(220,158,74,0.4)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(220,158,74,0.15)'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-100 transition-opacity">
              <ArrowRight className="w-4 h-4 text-brand-500" />
            </div>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(220,158,74,0.15)', border: '1px solid rgba(220,158,74,0.3)', color: '#dc9e4a' }}>
                  {item.client.personal.firstName[0]}
                </div>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(245,237,220,0.8)' }}>
                  {item.match.personal.firstName[0]}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate" style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#f5eddc', fontWeight: 500 }}>
                  {item.client.personal.firstName} & {item.match.personal.firstName}
                </p>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: '#dc9e4a', fontWeight: 600 }}>
                  {item.score}% Match
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}