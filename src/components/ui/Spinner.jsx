/**
 * Branded loading spinner.
 * Sizes: sm (16px), md (24px), lg (40px)
 * Used in ProtectedRoute, Button loading state, and any async operation.
 */

const SIZE_MAP = {
  sm: 16,
  md: 24,
  lg: 40,
}

const STROKE_MAP = {
  sm: 2,
  md: 2.5,
  lg: 3,
}

export default function Spinner({ size = 'md', color = '#b8822a', className = '' }) {
  const px     = SIZE_MAP[size]  ?? SIZE_MAP.md
  const stroke = STROKE_MAP[size] ?? STROKE_MAP.md
  const r      = (px / 2) - stroke
  const circ   = 2 * Math.PI * r

  return (
    <svg
      width={px}
      height={px}
      viewBox={`0 0 ${px} ${px}`}
      fill="none"
      className={`animate-spin-slow ${className}`}
      aria-hidden="true"
    >
      {/* Background track */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={color}
        strokeOpacity="0.2"
        strokeWidth={stroke}
      />
      {/* Spinning arc — 25% of circumference */}
      <circle
        cx={px / 2}
        cy={px / 2}
        r={r}
        stroke={color}
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={`${circ * 0.25} ${circ * 0.75}`}
        transform={`rotate(-90 ${px / 2} ${px / 2})`}
      />
    </svg>
  )
}