import { useEffect } from 'react'
import { subscribeToAuthChanges } from '@/firebase/auth'
import useAuthStore from '@/store/authStore'

// Selectors defined at module scope to maintain referential stability.
// Inline selectors create new function references on every render,
// causing unnecessary re-subscriptions in Zustand.
const selectSetUser  = (s) => s.setUser
const selectClearUser = (s) => s.clearUser
const selectUser     = (s) => s.user
const selectLoading  = (s) => s.loading

/**
 * Wires the Firebase auth state listener to the Zustand store.
 * Call this exactly once — at the root App component level.
 */
export function useAuthListener() {
  const setUser   = useAuthStore(selectSetUser)
  const clearUser = useAuthStore(selectClearUser)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        // Store only serializable, app-relevant fields
        setUser({
          uid:         firebaseUser.uid,
          email:       firebaseUser.email,
          displayName: firebaseUser.displayName ?? firebaseUser.email,
        })
      } else {
        clearUser()
      }
    })

    // Critical: unsubscribe on unmount to prevent listener leaks
    return () => unsubscribe()
  }, [setUser, clearUser])
}

/**
 * Returns the current authenticated user object, or null.
 */
export function useCurrentUser() {
  return useAuthStore(selectUser)
}

/**
 * Returns true while Firebase is resolving the initial auth state.
 */
export function useAuthLoading() {
  return useAuthStore(selectLoading)
}