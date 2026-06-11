import { create } from 'zustand'


const useUiStore = create((set) => ({
  searchQuery:  '',
  statusFilter: 'All',
  aiFilters:    null,
  advancedFilters: {},
  sidebarOpen:  false,

  setSearchQuery:     (query)   => set({ searchQuery: query }),
  setStatusFilter:    (filter)  => set({ statusFilter: filter }),
  setAiFilters:       (filters) => set({ aiFilters: filters }),
  setAdvancedFilters: (filters) => set((state) => ({ advancedFilters: { ...state.advancedFilters, ...filters } })),
  clearAdvancedFilters: ()      => set({ advancedFilters: {} }),
  setSidebarOpen:     (open)    => set({ sidebarOpen: open }),
  toggleSidebar:      ()        => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  resetFilters: () => set({ searchQuery: '', statusFilter: 'All', aiFilters: null, advancedFilters: {} }),
}))

export default useUiStore