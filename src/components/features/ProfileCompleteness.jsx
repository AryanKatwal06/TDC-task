import React from 'react'

export default function ProfileCompleteness({ completeness }) {
  if (!completeness) return null

  const { score, missing } = completeness

  let colorClass = 'bg-brand-500'
  if (score < 50) colorClass = 'bg-red-500'
  else if (score < 80) colorClass = 'bg-amber-500'
  else if (score >= 100) colorClass = 'bg-green-500'

  return (
    <div style={{ background: '#161512', border: '1px solid rgba(220,158,74,0.15)', borderRadius: '12px', padding: '16px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
      <div className="flex items-center justify-between mb-2">
        <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(220,158,74,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Profile Completeness</h4>
        <span className={`text-xs font-bold ${score >= 100 ? 'text-green-400' : 'text-brand-400'}`}>
          {score}%
        </span>
      </div>
      
      <div className="w-full rounded-full h-2 mb-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
        <div 
          className={`h-2 rounded-full ${colorClass} transition-all duration-1000`} 
          style={{ width: `${Math.min(100, score)}%` }}
        />
      </div>

      {missing && missing.length > 0 && (
        <div className="mt-3">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>Missing key fields:</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((field, i) => (
              <span key={i} className="text-[10px] font-medium bg-red-500/10 text-red-400 px-2 py-0.5 rounded border border-red-500/20">
                {field}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
