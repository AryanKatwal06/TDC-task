import { useState } from 'react'

/**
 * Floating label input field.
 *
 * The label starts inside the input field (like a placeholder).
 * When the input is focused or has a value, the label floats
 * upward and scales down — creating a premium form feel.
 *
 * Also supports an optional right-side element (e.g. eye toggle for password).
 *
 * Accessibility: label is always present in the DOM (not replaced by placeholder),
 * ensuring screen readers always have context for the field.
 */
export default function Input({
  id,
  label,
  type        = 'text',
  value,
  onChange,
  autoFocus   = false,
  rightElement = null,
  error        = null,
  autoComplete,
  className    = '',
}) {
  const [focused, setFocused] = useState(false)

  // Label floats when field is focused OR when it has a value
  const floated = focused || (value !== undefined && value !== null && String(value).length > 0)

  const borderColor = error
    ? '#be123c'
    : focused
      ? '#dc9e4a'
      : 'rgba(220, 158, 74, 0.35)'

  const boxShadow = error
    ? '0 0 0 3px rgba(190,18,60,0.15)'
    : focused
      ? '0 0 0 3px rgba(220,158,74,0.2)'
      : 'none'

  return (
    <div className={`relative w-full ${className}`}>
      {/* Floating label */}
      <label
        htmlFor={id}
        className="absolute left-4 pointer-events-none select-none transition-all duration-200"
        style={{
          top:             floated ? '8px'    : '50%',
          transform:       floated ? 'translateY(0) scale(0.78)' : 'translateY(-50%) scale(1)',
          transformOrigin: 'left center',
          fontSize:        '14px',
          lineHeight:      1,
          color:           error ? '#be123c' : focused ? '#dc9e4a' : '#7d5115',
          fontFamily:      'var(--font-body)',
          zIndex:          1,
        }}
      >
        {label}
      </label>

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        autoFocus={autoFocus}
        autoComplete={autoComplete}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full rounded-lg outline-none transition-all duration-200"
        style={{
          height:      '52px',
          paddingTop:  floated ? '20px' : '0',
          paddingBottom: floated ? '4px' : '0',
          paddingLeft:  '16px',
          paddingRight: rightElement ? '44px' : '16px',
          fontSize:     '15px',
          background:   '#ffffff',
          color:        '#111111',
          border:       `1px solid ${borderColor}`,
          boxShadow,
          fontFamily:   'var(--font-body)',
        }}
      />

      {/* Right element (e.g. show/hide password toggle) */}
      {rightElement && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
          {rightElement}
        </div>
      )}

      {/* Inline error message */}
      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-xs"
          style={{ color: '#be123c', fontFamily: 'var(--font-body)' }}
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}