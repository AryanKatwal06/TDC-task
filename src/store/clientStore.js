import { create } from 'zustand'

/**
 * Global store for client data.
 *
 * clients: array of all client documents assigned to the logged-in matchmaker.
 *          Loaded once on dashboard mount, cached for the session.
 *
 * selectedClientId: the Firestore document ID of the currently-viewed client.
 *                   Set when navigating to ClientDetailPage.
 *
 * loading: true while the initial Firestore fetch is in progress.
 *
 * error: string message if the fetch failed, null otherwise.
 *
 * updateClientLocally: performs an optimistic local update to a client in the
 *   array. Used for notes — we update the UI immediately so the matchmaker
 *   sees their note appear instantly, then the async Firestore write happens
 *   in the background. If the write fails the error is shown but the local
 *   state remains (good enough for an internal tool at this scale).
 */
const useClientStore = create((set, get) => ({
  clients:          [],
  selectedClientId: null,
  loading:          false,
  error:            null,

  setClients: (clients) => set({ clients, loading: false, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error, loading: false }),

  setSelectedClientId: (id) => set({ selectedClientId: id }),

  /**
   * Merges a partial update into one client in the local array.
   * The merge is shallow on the top-level fields but deep on nested
   * objects (notes array, sentMatches array).
   *
   * Example usage (adding a note optimistically):
   *   updateClientLocally(clientId, { notes: [...existingNotes, newNote] })
   */
  updateClientLocally: (clientId, partialUpdate) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, ...partialUpdate } : c
      ),
    }))
  },

  /**
   * Returns the full client object for the currently selected client.
   * Returns null if no client is selected or the array is empty.
   * Defined as a getter on the store (not a selector hook) because it
   * requires reading two pieces of state simultaneously.
   */
  getSelectedClient: () => {
    const { clients, selectedClientId } = get()
    return clients.find((c) => c.id === selectedClientId) ?? null
  },

  clearClients: () => set({ clients: [], selectedClientId: null, error: null }),
}))

export default useClientStore