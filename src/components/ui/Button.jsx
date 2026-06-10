import Spinner from './Spinner'

// Strings are used instead of objects because Tailwind's purge needs static class strings.

const ArrowIcon = () => (
  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-tdc-green-light ml-2 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="19" x2="19" y2="5" />
      <polyline points="9 5 19 5 19 15" />
    </svg>
  </span>
)

const BASE =
  'group inline-flex items-center justify-center font-body font-medium ' +
  'transition-all duration-200 select-none ' +
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ' +
  'focus-visible:outline-brand-500 disabled:opacity-50 disabled:cursor-not-allowed ' +
  // active:scale-[0.98] makes clicks feel physical
  'active:scale-[0.98]'

const VARIANTS = {
  primary:
    'bg-tdc-green text-white hover:bg-tdc-dark rounded-full ' +
    'focus-visible:outline-brand-500 shadow-md hover:shadow-lg',
  secondary:
    'border border-brand-300 text-brand-700 bg-transparent rounded-full ' +
    'hover:bg-brand-50 hover:border-brand-500',
  ghost:
    'text-brand-600 bg-transparent hover:bg-brand-50 rounded-full',
  danger:
    'bg-crimson-700 text-white hover:bg-crimson-900 rounded-full',
}

const SIZES = {
  sm: 'h-8  px-4 text-sm',
  md: 'h-11 pl-6 pr-4 text-sm', // Extra left padding to balance the arrow on the right
  lg: 'h-[52px] pl-8 pr-5 text-base',
}

export default function Button({
  children,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  type     = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const isPrimary = variant === 'primary'

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...rest}
    >
      {loading && <Spinner size="sm" color="currentColor" className="mr-2" />}
      {children}
      {isPrimary && !loading && <ArrowIcon />}
    </button>
  )
}