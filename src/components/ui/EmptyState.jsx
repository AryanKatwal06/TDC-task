/**
 * Reusable empty/error/no-results state component.
 * Used throughout the app wherever a list has no items to show.
 */
export default function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      {icon && (
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
          style={{ background: 'rgba(220,158,74,0.1)' }}
        >
          {icon}
        </div>
      )}
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.125rem', color: '#f5eddc', fontWeight: 500, marginBottom: '6px' }}>
        {title}
      </p>
      {description && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(220,158,74,0.8)', lineHeight: 1.6, maxWidth: '280px', marginBottom: action ? '20px' : '0' }}>
          {description}
        </p>
      )}
      {action && action}
    </div>
  )
}