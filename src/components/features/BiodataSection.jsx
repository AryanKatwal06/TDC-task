/**
 * Renders a labeled section of biodata fields.
 *
 * Each section has a header (icon + title) and a grid of field/value pairs.
 * Fields with no value render "Not specified" in muted text — never blank.
 *
 * Used by ClientDetailPage to render all biodata groups:
 *   Personal | Professional | Lifestyle | Cultural | Preferences | Family
 */

function Field({ label, value }) {
  const isEmpty = value === null || value === undefined || String(value).trim() === ''
  const display = isEmpty
    ? 'Not specified'
    : Array.isArray(value)
      ? value.join(', ')
      : String(value)

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(220,158,74,0.8)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
        {label}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: isEmpty ? 'rgba(220,158,74,0.4)' : '#f5eddc', lineHeight: 1.5, fontStyle: isEmpty ? 'italic' : 'normal' }}>
        {display}
      </p>
    </div>
  )
}

export default function BiodataSection({ title, icon, fields, columns = 2 }) {
  return (
    <div>
      {/* Section header */}
      <div
        className="flex items-center gap-2.5 mb-4 pb-3"
        style={{ borderBottom: '1px solid rgba(220,158,74,0.3)' }}
      >
        {icon && (
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
            style={{ background: 'rgba(220,158,74,0.15)' }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#f5eddc', fontWeight: 500 }}>
          {title}
        </h3>
      </div>

      {/* Fields grid */}
      <div
        className="grid gap-x-6 gap-y-5"
        style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
      >
        {fields.map(({ label, value }) => (
          <Field key={label} label={label} value={value} />
        ))}
      </div>
    </div>
  )
}