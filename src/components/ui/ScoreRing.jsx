import React from 'react'

/**
 * Animated SVG progress ring.
 * Color scales based on score:
 * < 50: crimson (low)
 * 50–64: amber (fair)
 * 65–79: brand (strong)
 * 80+: jade (exceptional)
 */
export default function ScoreRing({ score, size = 64, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  let colorClass = 'text-brand' // default
  if (score >= 80) colorClass = 'text-jade'
  else if (score >= 65) colorClass = 'text-brand'
  else if (score >= 50) colorClass = 'text-amber'
  else colorClass = 'text-crimson'

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-surface-200"
        />
        {/* Animated progress indicator */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${colorClass} transition-all duration-1000 ease-out`}
        />
      </svg>
      {/* Score Text */}
      <span className="absolute text-sm font-semibold text-surface-900">{score}</span>
    </div>
  )
}
