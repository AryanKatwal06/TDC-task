import { create } from 'zustand'

const useAuthStore = create((set) => ({
  // We store only the fields we use — not the entire Firebase User object.
  user:        null,
  // Prevents FOUC before Firebase resolves the session.
  loading:     true,
  // Used by ProtectedRoute to distinguish "loading" from "no user".
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