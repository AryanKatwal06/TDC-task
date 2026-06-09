import { useState, useEffect } from 'react'
import { useNavigate, Link }   from 'react-router-dom'
import { signIn }              from '@/firebase/auth'
import useAuthStore            from '@/store/authStore'
import Button                  from '@/components/ui/Button'
import Input                   from '@/components/ui/Input'

// ─── Firebase error code → human-readable message ────────────
const AUTH_ERRORS = {
  'auth/user-not-found':         'No matchmaker account found with this email.',
  'auth/wrong-password':         'Incorrect password. Please try again.',
  'auth/invalid-credential':     'Invalid email or password.',
  'auth/invalid-email':          'Please enter a valid email address.',
  'auth/too-many-requests':      'Too many attempts. Please wait a few minutes.',
  'auth/network-request-failed': 'Network error. Check your connection.',
  'auth/user-disabled':          'This account has been disabled. Contact your admin.',
}

function parseAuthError(code) {
  return AUTH_ERRORS[code] ?? 'Something went wrong. Please try again.'
}

// ─── Icon components (inline SVG — no icon library dependency) ─
function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21C12 21 3 14.5 3 8.5C3 6.01 4.79 4 7 4C9.03 4 10.8 5.69 12 7.5C13.2 5.69 14.97 4 17 4C19.21 4 21 6.01 21 8.5C21 14.5 12 21 12 21Z"
        fill="rgba(190,18,60,0.85)"
        stroke="rgba(190,18,60,0.4)"
        strokeWidth="0.5"
      />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

// ─── Stat item for the left panel ─────────────────────────────
function Stat({ value, label }) {
  return (
    <div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', color: '#d4a853', fontWeight: 600, lineHeight: 1.1 }}>
        {value}
      </p>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(242,232,213,0.45)', marginTop: '3px', letterSpacing: '0.04em' }}>
        {label}
      </p>
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────
const selectUser    = (s) => s.user
const selectLoading = (s) => s.loading

export default function LoginPage() {
  const navigate    = useNavigate()
  const user        = useAuthStore(selectUser)
  const authLoading = useAuthStore(selectLoading)

  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState(null)

  // Redirect already-authenticated users away from the login page
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/dashboard', { replace: true })
    }
  }, [user, authLoading, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await signIn(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(parseAuthError(err.code))
    } finally {
      // Always reset loading — whether success or failure
      setLoading(false)
    }
  }

  const canSubmit = email.trim().length > 0 && password.length > 0

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* ══════════════════════════════════════════════════════
          LEFT PANEL — Brand / Visual
      ══════════════════════════════════════════════════════ */}
      <div
        className="hidden lg:flex flex-col justify-between p-10 relative overflow-hidden bg-tdc-dark"
        aria-hidden="true"
      >
        {/* Ambient glow from bottom center */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 55% at 50% 105%, rgba(220, 158, 74, 0.15) 0%, transparent 68%)',
          }}
        />

        {/* Decorative watermark quote mark */}
        <div
          className="absolute bottom-8 right-6 select-none pointer-events-none"
          style={{
            fontSize:   '20rem',
            lineHeight: 1,
            color:      'rgba(220, 158, 74, 0.05)',
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
          }}
        >
          ❝
        </div>

        {/* Brand lockup */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div
            className="w-9 h-9 flex items-center justify-center rounded-md"
            style={{ border: '1px solid rgba(220, 158, 74, 0.4)', background: 'rgba(220, 158, 74, 0.08)' }}
          >
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#dc9e4a', fontWeight: 600, letterSpacing: '0.05em' }}>
              TDC
            </span>
          </div>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
            The Date Crew
          </span>
        </div>

        {/* Headline */}
        <div className="relative z-10 space-y-4">
          <p
            className="text-balance"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize:   'clamp(1.9rem, 2.8vw, 2.8rem)',
              lineHeight: 1.22,
              color:      '#f5eddc',
              fontWeight: 500,
            }}
          >
            Where hearts find<br />
            <span style={{ color: '#dc9e4a', fontStyle: 'italic' }}>their perfect match.</span>
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(242,232,213,0.45)', letterSpacing: '0.03em' }}>
            Trusted by matchmakers across India
          </p>
        </div>

        {/* Stats strip */}
        <div className="relative z-10 flex items-center gap-0">
          {[
            { value: '2,400+', label: 'Matches Made' },
            { value: '98%',    label: 'Satisfaction' },
            { value: '15+',    label: 'Cities' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              {i > 0 && (
                <div className="w-px h-7 mx-5" style={{ background: 'rgba(220, 158, 74, 0.22)' }} />
              )}
              <Stat value={stat.value} label={stat.label} />
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          RIGHT PANEL — Login Form
      ══════════════════════════════════════════════════════ */}
      <div
        className="flex items-center justify-center min-h-screen px-6 py-12 bg-white"
      >
        <div className="w-full animate-fade-up" style={{ maxWidth: '380px' }}>

          {/* Logo mark */}
          <div className="flex items-center gap-2 mb-10">
            <HeartIcon />
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#111111', fontWeight: 600 }}>
              The Date Crew
            </span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 500, color: '#111111', lineHeight: 1.15, marginBottom: '6px' }}>
              Welcome back
            </h1>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#7d5115', lineHeight: 1.5 }}>
              Sign in to your matchmaker portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>

            <Input
              id="email"
              label="Email address"
              type="email"
              value={email}
              onChange={setEmail}
              autoFocus
              autoComplete="email"
            />

            <Input
              id="password"
              label="Password"
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="text-brand-400 hover:text-brand-600 transition-colors p-0.5"
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon open={showPass} />
                </button>
              }
            />

            {/* Error banner — only shown when there is an error */}
            {error && (
              <div
                className="flex items-start gap-3 px-4 py-3 rounded-lg animate-fade-up"
                style={{
                  background:  '#fff1f2',
                  borderLeft:  '3px solid #be123c',
                  fontFamily:  'var(--font-body)',
                }}
                role="alert"
                aria-live="assertive"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#be123c" strokeWidth="2" strokeLinecap="round" className="mt-0.5 shrink-0" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span className="flex-1 text-sm" style={{ color: '#9f1239', lineHeight: 1.5 }}>
                  {error}
                </span>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-crimson-700 opacity-60 hover:opacity-100 transition-opacity mt-0.5 shrink-0"
                  aria-label="Dismiss error"
                >
                  <CloseIcon />
                </button>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              disabled={!canSubmit}
              className="w-full"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.01em' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-8 space-y-3">
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#7d5115' }}>
              Don't have an account?{' '}
              <Link to="/register" className="font-medium hover:underline" style={{ color: '#dc9e4a' }}>
                Sign up
              </Link>
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(125,81,21,0.55)', letterSpacing: '0.03em' }}>
              Matchmaker portal — authorized access only
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}