import React from 'react'

const STAGES = [
  { id: 'New', label: 'Lead' },
  { id: 'Active', label: 'Active Matching' },
  { id: 'Sent', label: 'Introductions Sent' },
  { id: 'Meeting', label: 'Meeting Scheduled' },
  { id: 'Matched', label: 'Success' },
]

export default function JourneyPipeline({ client }) {
  // Determine current stage based on status and match history
  let currentStageIndex = 0
  
  if (client.statusTag === 'Matched') currentStageIndex = 4
  else if (client.statusTag === 'Active') {
    if (client.sentMatches?.length > 0) currentStageIndex = 2
    else currentStageIndex = 1
  }

  return (
    <div className="mb-8 pb-6">
      <h3 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(220,158,74,0.8)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '16px' }}>Journey Pipeline</h3>
      <div className="relative flex justify-between items-center px-4">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2 z-0 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
        
        {/* Fill Track */}
        <div 
          className="absolute top-1/2 left-0 h-1 bg-brand-500 -translate-y-1/2 z-0 rounded-full transition-all duration-700"
          style={{ width: `${(currentStageIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {/* Steps */}
        {STAGES.map((stage, i) => {
          const isActive = i === currentStageIndex
          const isPast = i < currentStageIndex

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <div 
                className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                  isActive 
                    ? 'bg-brand-500 border-brand-500 shadow-[0_0_10px_rgba(220,158,74,0.5)] ring-4 ring-brand-500/20' 
                    : isPast 
                      ? 'bg-brand-500 border-brand-500' 
                      : 'border-[rgba(255,255,255,0.2)] bg-[#111111]'
                }`}
              />
              <span className={`absolute top-6 text-[10px] sm:text-xs font-medium whitespace-nowrap transition-colors duration-300`} style={{
                color: isActive ? '#dc9e4a' : isPast ? 'rgba(245,237,220,0.8)' : 'rgba(255,255,255,0.4)',
                fontFamily: 'var(--font-body)'
              }}>
                {stage.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}