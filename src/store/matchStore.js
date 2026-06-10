import { create } from 'zustand'


const useMatchStore = create((set, get) => ({
  matches:       [],
  // We use setTimeout(0) to set this to true before running the engine so the browser paints the loading state.
  computing:     false,
  error:         null,
  // We paginate client-side for performance and better UX.
  visibleCount:  15,

  setMatches:   (matches) => set({ matches, computing: false, error: null }),
  setComputing: (computing) => set({ computing }),
  setError:     (error) => set({ error, computing: false }),

  showMore: () => set((s) => ({ visibleCount: s.visibleCount + 15 })),
  resetVisible: () => set({ visibleCount: 15 }),

  // Optimistic update for immediate feedback without waiting for Firestore.
  markSentLocally: (profileId) => {
    set((state) => ({
      matches: state.matches.map((m) =>
        m.profile.id === profileId ? { ...m, alreadySent: true } : m
      ),
    }))
  },

  clearMatches: () => set({ matches: [], visibleCount: 15, error: null }),
}))

export default useMatchStore
