import { describe, it, expect, beforeEach } from 'vitest'
import useAuthStore from '@/store/authStore'

// Reset store to initial state before each test
beforeEach(() => {
  useAuthStore.setState({
    user:        null,
    loading:     true,
    initialized: false,
  })
})

describe('authStore — initial state', () => {
  it('starts with null user', () => {
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('starts with loading=true', () => {
    expect(useAuthStore.getState().loading).toBe(true)
  })

  it('starts with initialized=false', () => {
    expect(useAuthStore.getState().initialized).toBe(false)
  })
})

describe('authStore — setUser', () => {
  const mockUser = { uid: 'abc123', email: 'test@tdc.com', displayName: 'Test Matchmaker' }

  it('sets the user object', () => {
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().user).toEqual(mockUser)
  })

  it('sets loading to false', () => {
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('sets initialized to true', () => {
    useAuthStore.getState().setUser(mockUser)
    expect(useAuthStore.getState().initialized).toBe(true)
  })
})

describe('authStore — clearUser', () => {
  it('clears the user to null', () => {
    useAuthStore.setState({ user: { uid: 'abc' }, loading: false, initialized: true })
    useAuthStore.getState().clearUser()
    expect(useAuthStore.getState().user).toBeNull()
  })

  it('sets loading to false', () => {
    useAuthStore.getState().clearUser()
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('sets initialized to true', () => {
    useAuthStore.getState().clearUser()
    expect(useAuthStore.getState().initialized).toBe(true)
  })
})

describe('authStore — setLoading', () => {
  it('updates loading flag without touching user or initialized', () => {
    const mockUser = { uid: 'abc' }
    useAuthStore.setState({ user: mockUser, initialized: true })
    useAuthStore.getState().setLoading(false)
    expect(useAuthStore.getState().loading).toBe(false)
    expect(useAuthStore.getState().user).toEqual(mockUser)
    expect(useAuthStore.getState().initialized).toBe(true)
  })
})