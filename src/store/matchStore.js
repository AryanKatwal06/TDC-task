import { create } from 'zustand'

/**
 * Stores computed match results for the currently-viewed client.
 *
 * matches:   Array of match result objects from the engine.
 *            Recomputed each time ClientDetailPage loads a new client.
 *
 * computing: True while the engine is running. The engine is synchronous
 *            and fast (<10ms for 120 profiles), but we show a brief
 *            loading state to avoid jarring instant content appearance.
 *
 * visibleCount: How many match cards are shown (default 15, "Show More" adds 15).
 */
const useMatchStore = create((set, get) => ({
  matches:       [],
  computing:     false,
  error:         null,
  visibleCount:  15,

  setMatches:   (matches) => set({ matches, computing: false, error: null }),
  setComputing: (computing) => set({ computing }),
  setError:     (error) => set({ error, computing: false }),

  showMore: () => set((s) => ({ visibleCount: s.visibleCount + 15 })),
  resetVisible: () => set({ visibleCount: 15 }),

  /**
   * Optimistically marks a match as sent in the local array.
   * Called immediately when the matchmaker confirms a Send Match action.
   * This makes the "Sent ✓" state appear instantly without waiting for Firestore.
   */
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
