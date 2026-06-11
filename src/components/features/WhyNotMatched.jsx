import React from 'react'

export default function WhyNotMatched({ reasons }) {
  if (!reasons || reasons.length === 0) return null

  return (
    <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-3 mt-4">
      <h4 className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">Why Not Matched</h4>
      <ul className="space-y-1">
        {reasons.map((reason, i) => (
          <li key={i} className="text-xs text-red-300 flex items-start gap-2">
            <span className="text-red-500">•</span>
            {reason}
          </li>
        ))}
      </ul>
    </div>
  )
}
