/**
 * Surface container component.
 * Provides consistent background, border, shadow, and border-radius.
 *
 * Use this as the wrapper for any content block that sits above the page background.
 */
export default function Card({ children, className = '', hover = false, onClick, padding = 'md' }) {
  const PAD = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }

  return (
    <div
      className={`
        rounded-xl bg-[#111111] transition-all duration-200
        ${hover ? 'cursor-pointer hover:shadow-card-hover hover:-translate-y-0.5' : ''}
        ${PAD[padding]}
        ${className}
      `}
      style={{ boxShadow: '0 8px 24px rgba(26,24,20,0.1)', border: '1px solid rgba(220,158,74,0.15)' }}
      onClick={onClick}
    >
      {children}
    </div>
  )
}