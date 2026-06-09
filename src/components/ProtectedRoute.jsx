import { Navigate } from 'react-router-dom'
import useAuthStore from '@/store/authStore'
import Spinner from '@/components/ui/Spinner'

// Selectors at module scope for referential stability
const selectUser    = (s) => s.user
const selectLoading = (s) => s.loading

/**
 * Renders children only when the user is authenticated.
 *
 * Three states:
 * 1. loading=true  → Show branded loading screen (Firebase resolving session)
 * 2. loading=false, user=null → Redirect to /login
 * 3. loading=false, user≠null → Render children
 *
 * The loading state prevents the brief redirect to /login that would
 * otherwise happen before Firebase resolves an existing session.
 */
export default function ProtectedRoute({ children }) {
  const user    = useAuthStore(selectUser)
  const loading = useAuthStore(selectLoading)

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-4"
        style={{ background: '#fdfcf8' }}
        role="status"
        aria-label="Loading your session"
      >
        <Spinner size="lg" />
        <p
          className="text-sm tracking-wide"
          style={{ fontFamily: 'var(--font-body)', color: '#9a6820' }}
        >
          Loading…
        </p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}