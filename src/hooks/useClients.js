import { useEffect, useRef } from 'react'
import { subscribeToClientsForMatchmaker } from '@/firebase/firestore'
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

// Auto-seed: if a user logs in and has zero clients, we populate the account
// with the dummy pool. We do this here rather than on the server because we
// are simulating a production onboarding flow entirely in the browser.
export function useClientsLoader() {
  const user       = useAuthStore(selectUser)
  const setClients = useClientStore(selectSetClients)
  const setLoading = useClientStore(selectSetLoading)
  const setError   = useClientStore(selectSetError)
  const isSeeding  = useRef(false)

  useEffect(() => {
    if (!user) return
    
    setLoading(true)
    setError(null)
    isSeeding.current = false // Reset seeding flag for this user

    const unsubscribe = subscribeToClientsForMatchmaker(
      user.uid,
      async (clientsData) => {
        if (clientsData.length === 0 && !isSeeding.current) {
          isSeeding.current = true
          try {
            const { seedDatabase } = await import('@/data/seed.js')
            await seedDatabase(user.uid)
            // Data will arrive in next snapshot automatically!
          } catch (err) {
            console.error('[DEBUG] Seeding Error:', err)
            setError('Failed to initialize clients.')
            setLoading(false)
          }
        } else if (clientsData.length > 0) {
          setClients(clientsData)
          isSeeding.current = false
        }
      },
      (err) => {
        console.error('[DEBUG] onSnapshot Error:', err)
        setError('Failed to load clients. Check your connection and try again.')
      }
    )

    return () => unsubscribe()
  }, [user?.uid, setClients, setLoading, setError])

  return { retry: () => {} }
}


export const useClients      = () => useClientStore(selectClients)
export const useClientsLoading = () => useClientStore(selectLoading)
export const useClientsError   = () => useClientStore(selectError)