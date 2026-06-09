import { useEffect, useCallback } from 'react'
import { subscribeToClients } from '@/firebase/firestore'
import useClientStore from '@/store/clientStore'
import useAuthStore   from '@/store/authStore'

// Module-scope selectors — never inline these in hook calls
const selectUser         = (s) => s.user
const selectSetClients   = (s) => s.setClients
const selectSetLoading   = (s) => s.setLoading
const selectSetError     = (s) => s.setError
const selectClients      = (s) => s.clients
const selectLoading      = (s) => s.loading
const selectError        = (s) => s.error

/**
 * Loads clients for the currently logged-in matchmaker.
 *
 * Subscribes to Firestore. If clients are already in the store
 * it seamlessly updates in the background.
 */
export function useClientsLoader() {
  const user       = useAuthStore(selectUser)
  const clients    = useClientStore(selectClients)
  const setClients = useClientStore(selectSetClients)
  const setLoading = useClientStore(selectSetLoading)
  const setError   = useClientStore(selectSetError)

  useEffect(() => {
    if (!user) return
    
    // Only show loading state if we have absolutely no data yet
    if (clients.length === 0) setLoading(true)

    const unsubscribe = subscribeToClients(
      user.uid,
      async (data) => {
        if (data.length === 0) {
          // First login — auto-seed for this matchmaker
          const { seedDatabase } = await import('@/data/seed.js')
          await seedDatabase(user.uid)
          // Note: we don't need to manually fetch again. The write
          // will trigger this snapshot listener automatically!
        } else {
          setClients(data)
        }
      },
      (err) => {
        setError('Failed to load clients. Check your connection and try again.')
      }
    )

    return () => unsubscribe()
  }, [user?.uid]) // Depend strictly on user ID

  // return a mock retry since it's realtime now
  return { retry: () => { setLoading(true); setTimeout(() => setLoading(false), 500) } }
}

// Simple read selectors — components use these, not the store directly
export const useClients      = () => useClientStore(selectClients)
export const useClientsLoading = () => useClientStore(selectLoading)
export const useClientsError   = () => useClientStore(selectError)