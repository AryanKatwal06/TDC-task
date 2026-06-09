import Sidebar from './Sidebar'
import useUiStore from '@/store/uiStore'

const selectSidebarOpen  = (s) => s.sidebarOpen
const selectSetSidebar   = (s) => s.setSidebarOpen

/**
 * The persistent outer frame of every authenticated page.
 *
 * Layout:
 * - Desktop (lg+): sidebar fixed-left (240px) + main content fills remaining width
 * - Mobile: sidebar slides in as an overlay when sidebarOpen=true
 *
 * All authenticated pages render as children of AppShell.
 * AppShell does not fetch data — it is purely structural.
 */
export default function AppShell({ children }) {
  const sidebarOpen  = useUiStore(selectSidebarOpen)
  const setSidebar   = useUiStore(selectSetSidebar)

  return (
    <div className="flex min-h-screen bg-tdc-dark">

      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 lg:hidden"
          style={{ background: 'rgba(26,24,20,0.45)' }}
          onClick={() => setSidebar(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar — always visible desktop, slide-in mobile */}
      <aside
        className="fixed top-0 left-0 h-full z-30 transition-transform duration-300 lg:translate-x-0"
        style={{
          width:     '240px',
          transform: sidebarOpen ? 'translateX(0)' : undefined,
        }}
      >
        <div
          className={`h-full ${sidebarOpen ? 'block' : 'hidden lg:block'}`}
        >
          <Sidebar onClose={() => setSidebar(false)} />
        </div>
      </aside>

      {/* Main content — offset by sidebar width on desktop */}
      <main
        className="flex-1 min-h-screen lg:ml-[240px] bg-tdc-dark"
      >
        {/* Mobile top bar */}
        <div
          className="lg:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-10"
          style={{ background: '#1a1814', borderColor: 'rgba(220,158,74,0.15)' }}
        >
          <button
            onClick={() => setSidebar(true)}
            className="p-1.5 rounded-lg hover:bg-[rgba(220,158,74,0.1)] transition-colors"
            aria-label="Open navigation"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#dc9e4a" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6"  x2="21" y2="6"  />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '15px', color: '#f5eddc', fontWeight: 600 }}>
            TDC Matchmaker
          </span>
        </div>

        {children}
      </main>
    </div>
  )
}