import { create } from 'zustand'


const useClientStore = create((set, get) => ({
  clients:          [],
  selectedClientId: null,
  loading:          true,
  error:            null,

  setClients: (clients) => set({ clients, loading: false, error: null }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set((state) => ({ error, loading: error !== null ? false : state.loading })),

  setSelectedClientId: (id) => set({ selectedClientId: id }),

  // Optimistic update: we update the local store before the Firestore write completes.
  // This makes UI actions (like adding notes) feel instant.
  // If the background Firestore write fails, the local state remains.
  updateClientLocally: (clientId, partialUpdate) => {
    set((state) => ({
      clients: state.clients.map((c) =>
        c.id === clientId ? { ...c, ...partialUpdate } : c
      ),
    }))
  },

  // Defined as a getter (not a selector hook) because it requires reading
  // two pieces of state simultaneously (clients + selectedClientId).
  getSelectedClient: () => {
    const { clients, selectedClientId } = get()
    return clients.find((c) => c.id === selectedClientId) ?? null
  },

  clearClients: () => set({ clients: [], selectedClientId: null, error: null, loading: false }),
}))

export default useClientStore