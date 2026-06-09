import { create } from 'zustand'

/**
 * Global auth state store.
 *
 * loading: true while Firebase is resolving the initial auth state.
 *          Prevents flash-of-unauthenticated-content on page load.
 *
 * initialized: false until the first auth state resolution.
 *              Used by ProtectedRoute to distinguish "loading" from "no user".
 *
 * user: null when not authenticated, or { uid, email, displayName } when signed in.
 *       We store only the fields we use — not the entire Firebase User object.
 */
const useAuthStore = create((set) => ({
  user:        null,
  loading:     true,
  initialized: false,

  setUser: (user) => set({
    user,
    loading:     false,
    initialized: true,
  }),

  clearUser: () => set({
    user:        null,
    loading:     false,
    initialized: true,
  }),

  setLoading: (loading) => set({ loading }),
}))

export default useAuthStore