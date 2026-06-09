import { create } from 'zustand'

/**
 * Global UI state store.
 *
 * Separation of concerns: auth state lives in authStore, data state lives in
 * clientStore, and ephemeral UI state (search query, active filters, sidebar
 * open/closed) lives here. This prevents UI concerns from polluting data stores.
 *
 * searchQuery: the current value in the dashboard search input.
 *              Used to filter the client list client-side (no Firestore calls).
 *
 * statusFilter: 'All' or one of the valid status tags.
 *               Combined with searchQuery to filter the displayed client list.
 *
 * sidebarOpen: controls mobile sidebar visibility.
 *              On desktop the sidebar is always visible — this only affects
 *              mobile viewports where the sidebar overlays the content.
 */
const useUiStore = create((set) => ({
  searchQuery:  '',
  statusFilter: 'All',
  sidebarOpen:  false,

  setSearchQuery:  (query)  => set({ searchQuery: query }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),
  setSidebarOpen:  (open)   => set({ sidebarOpen: open }),
  toggleSidebar:   ()       => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  resetFilters: () => set({ searchQuery: '', statusFilter: 'All' }),
}))

export default useUiStore