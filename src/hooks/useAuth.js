import { useEffect } from 'react'
import { subscribeToAuthChanges } from '@/firebase/auth'
import useAuthStore from '@/store/authStore'

// Selector functions defined at module scope, not inline in hook calls.
// Inline selectors create a new function reference on every render,
// which causes Zustand to re-subscribe unnecessarily.
const selectSetUser  = (s) => s.setUser
const selectClearUser = (s) => s.clearUser
const selectUser     = (s) => s.user
const selectLoading  = (s) => s.loading

// Call this exactly once at the root App component level.
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


export function useCurrentUser() {
  return useAuthStore(selectUser)
}


export function useAuthLoading() {
  return useAuthStore(selectLoading)
}