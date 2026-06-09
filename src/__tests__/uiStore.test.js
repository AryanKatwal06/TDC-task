import { describe, it, expect, beforeEach } from 'vitest'
import useUiStore from '@/store/uiStore'

beforeEach(() => {
  useUiStore.setState({ searchQuery: '', statusFilter: 'All', sidebarOpen: false })
})

describe('uiStore — setSearchQuery', () => {
  it('updates the search query', () => {
    useUiStore.getState().setSearchQuery('Arjun')
    expect(useUiStore.getState().searchQuery).toBe('Arjun')
  })
})

describe('uiStore — setStatusFilter', () => {
  it('updates the status filter', () => {
    useUiStore.getState().setStatusFilter('Active')
    expect(useUiStore.getState().statusFilter).toBe('Active')
  })
})

describe('uiStore — toggleSidebar', () => {
  it('toggles false to true', () => {
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(true)
  })

  it('toggles true to false', () => {
    useUiStore.setState({ sidebarOpen: true })
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(false)
  })
})

describe('uiStore — resetFilters', () => {
  it('resets search and filter to defaults', () => {
    useUiStore.setState({ searchQuery: 'Mumbai', statusFilter: 'Active' })
    useUiStore.getState().resetFilters()
    expect(useUiStore.getState().searchQuery).toBe('')
    expect(useUiStore.getState().statusFilter).toBe('All')
  })

  it('does not reset sidebarOpen', () => {
    useUiStore.setState({ sidebarOpen: true })
    useUiStore.getState().resetFilters()
    expect(useUiStore.getState().sidebarOpen).toBe(true)
  })
})