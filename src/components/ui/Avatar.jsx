// Deterministic color from name — same name always produces the same color,
// preventing visual flickering on re-renders.
function nameToColor(name) {
  const PALETTES = [
    { bg: '#f7ead6', text: '#7d511a' },   // brand warm
    { bg: '#fde8e8', text: '#9f1239' },   // rose
    { bg: '#e8f4f0', text: '#065f46' },   // teal
    { bg: '#ede9fe', text: '#5b21b6' },   // violet
    { bg: '#fef3c7', text: '#92400e' },   // amber
    { bg: '#e0f2fe', text: '#075985' },   // sky
    { bg: '#fce7f3', text: '#9d174d' },   // pink
    { bg: '#ecfdf5', text: '#065f46' },   // green
  ]
  let hash = 0
  // Intentionally simple, non-cryptographic hash function.
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return PALETTES[Math.abs(hash) % PALETTES.length]
}

function getInitials(name) {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const SIZE_MAP = {
  xs: { px: 28, font: '10px' },
  sm: { px: 32, font: '11px' },
  md: { px: 40, font: '13px' },
  lg: { px: 52, font: '16px' },
  xl: { px: 68, font: '20px' },
}

export default function Avatar({ name = '?', size = 'md', className = '' }) {
  const { px, font } = SIZE_MAP[size] ?? SIZE_MAP.md
  const { bg, text } = nameToColor(name)
  const initials     = getInitials(name)

  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 select-none ${className}`}
      style={{
        width:      px,
        height:     px,
        background: bg,
        color:      text,
        fontSize:   font,
        fontFamily: 'var(--font-body)',
        fontWeight: 600,
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  )
}