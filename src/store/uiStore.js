import { create } from 'zustand'


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