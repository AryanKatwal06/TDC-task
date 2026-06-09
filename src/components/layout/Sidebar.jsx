import { useNavigate, useLocation } from 'react-router-dom'
import { signOut }    from '@/firebase/auth'
import useAuthStore   from '@/store/authStore'
import useClientStore from '@/store/clientStore'

const selectUser      = (s) => s.user
const selectClearUser = (s) => s.clearUser
const selectClearClients = (s) => s.clearClients

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href:  '/dashboard',
    icon: (active) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={active ? '#dc9e4a' : '#7d5115'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
]

export default function Sidebar({ onClose }) {
  const navigate     = useNavigate()
  const location     = useLocation()
  const user         = useAuthStore(selectUser)
  const clearUser    = useAuthStore(selectClearUser)
  const clearClients = useClientStore(selectClearClients)

  async function handleSignOut() {
    try {
      await signOut()
      clearClients()
      clearUser()
      navigate('/login', { replace: true })
    } catch {
      // Sign out failure is non-critical — force navigate anyway
      navigate('/login', { replace: true })
    }
  }

  return (
    <div
      className="h-full flex flex-col bg-tdc-dark"
      style={{ borderRight: '1px solid rgba(220,158,74,0.15)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-md flex items-center justify-center"
            style={{ background: 'rgba(220,158,74,0.15)', border: '1px solid rgba(220,158,74,0.3)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 21C12 21 3 14.5 3 8.5C3 6.01 4.79 4 7 4C9.03 4 10.8 5.69 12 7.5C13.2 5.69 14.97 4 17 4C19.21 4 21 6.01 21 8.5C21 14.5 12 21 12 21Z" fill="rgba(190,18,60,0.9)" />
            </svg>
          </div>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '12px', color: '#dc9e4a', fontWeight: 600, lineHeight: 1 }}>
              TDC
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(220,158,74,0.55)', letterSpacing: '0.08em' }}>
              Matchmaker
            </p>
          </div>
        </div>

        {/* Close button (mobile only) */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded"
          style={{ color: 'rgba(242,232,213,0.4)' }}
          aria-label="Close navigation"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(220,158,74,0.1)', margin: '0 16px' }} />

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-4 space-y-1" aria-label="Main navigation">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.href
          return (
            <button
              key={item.href}
              onClick={() => { navigate(item.href); onClose?.() }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-left"
              style={{
                background:  active ? 'rgba(220,158,74,0.15)' : 'transparent',
                color:       active ? '#dc9e4a' : 'rgba(242,232,213,0.6)',
                fontFamily:  'var(--font-body)',
                fontSize:    '13px',
                fontWeight:  active ? '500' : '400',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(220,158,74,0.08)' }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent' }}
              aria-current={active ? 'page' : undefined}
            >
              {item.icon(active)}
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Matchmaker identity + sign out */}
      <div style={{ borderTop: '1px solid rgba(220,158,74,0.1)', padding: '12px 16px' }}>
        <div className="mb-2">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(242,232,213,0.7)', fontWeight: '500', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.displayName ?? 'Matchmaker'}
          </p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(242,232,213,0.35)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {user?.email ?? ''}
          </p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-left"
          style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(242,232,213,0.45)' }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(242,232,213,0.06)'; e.currentTarget.style.color = 'rgba(242,232,213,0.75)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(242,232,213,0.45)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sign out
        </button>
      </div>
    </div>
  )
}