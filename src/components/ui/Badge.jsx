/**
 * Status and label badge pill.
 *
 * Variants mapped to TDC status tags:
 *   Active    → jade (green)
 *   Matched   → brand (gold)
 *   New       → sky (blue-ish)
 *   On Hold   → amber (warm yellow)
 *   Paused    → neutral (gray)
 */

const VARIANT_STYLES = {
  jade:    { background: 'rgba(34,197,94,0.1)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' },
  brand:   { background: 'rgba(220,158,74,0.1)', color: '#dc9e4a', border: '1px solid rgba(220,158,74,0.3)' },
  crimson: { background: 'rgba(244,63,94,0.1)', color: '#fb7185', border: '1px solid rgba(244,63,94,0.2)' },
  sky:     { background: 'rgba(14,165,233,0.1)', color: '#38bdf8', border: '1px solid rgba(14,165,233,0.2)' },
  amber:   { background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)' },
  neutral: { background: 'rgba(163,163,163,0.1)', color: '#a3a3a3', border: '1px solid rgba(163,163,163,0.2)' },
  violet:  { background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' },
}

// Maps the semantic status tag name to a visual variant
const STATUS_VARIANT_MAP = {
  'Active':   'jade',
  'Matched':  'brand',
  'New':      'sky',
  'On Hold':  'amber',
  'Paused':   'neutral',
}

export function getVariantForStatus(status) {
  return STATUS_VARIANT_MAP[status] ?? 'neutral'
}

export default function Badge({ label, variant = 'neutral', size = 'sm' }) {
  const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.neutral

  return (
    <span
      className="inline-flex items-center rounded-full font-medium"
      style={{
        ...styles,
        fontFamily: 'var(--font-body)',
        fontSize:   size === 'sm' ? '11px' : '12px',
        fontWeight: 500,
        padding:    size === 'sm' ? '2px 8px' : '3px 10px',
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  )
}