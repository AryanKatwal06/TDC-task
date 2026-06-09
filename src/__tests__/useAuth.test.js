import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAuthListener, useCurrentUser, useAuthLoading } from '@/hooks/useAuth'
import { subscribeToAuthChanges } from '@/firebase/auth'
import useAuthStore from '@/store/authStore'

beforeEach(() => {
  useAuthStore.setState({ user: null, loading: true, initialized: false })
})

describe('useAuthListener', () => {
  it('subscribes to auth changes on mount', () => {
    renderHook(() => useAuthListener())
    expect(subscribeToAuthChanges).toHaveBeenCalledTimes(1)
  })

  it('calls setUser when Firebase returns a user', () => {
    const mockFirebaseUser = { uid: 'uid1', email: 'a@b.com', displayName: 'Alice' }

    subscribeToAuthChanges.mockImplementation((cb) => {
      cb(mockFirebaseUser)
      return vi.fn()
    })

    renderHook(() => useAuthListener())

    const { user } = useAuthStore.getState()
    expect(user).toEqual({
      uid:         'uid1',
      email:       'a@b.com',
      displayName: 'Alice',
    })
  })

  it('calls clearUser when Firebase returns null', () => {
    subscribeToAuthChanges.mockImplementation((cb) => {
      cb(null)
      return vi.fn()
    })

    renderHook(() => useAuthListener())
    expect(useAuthStore.getState().user).toBeNull()
    expect(useAuthStore.getState().loading).toBe(false)
  })

  it('returns unsubscribe function and calls it on unmount', () => {
    const unsubscribe = vi.fn()
    subscribeToAuthChanges.mockReturnValue(unsubscribe)

    const { unmount } = renderHook(() => useAuthListener())
    unmount()
    expect(unsubscribe).toHaveBeenCalledTimes(1)
  })

  it('uses displayName fallback to email when displayName is null', () => {
    subscribeToAuthChanges.mockImplementation((cb) => {
      cb({ uid: 'u1', email: 'x@y.com', displayName: null })
      return vi.fn()
    })
    renderHook(() => useAuthListener())
    expect(useAuthStore.getState().user.displayName).toBe('x@y.com')
  })
})

describe('useCurrentUser', () => {
  it('returns null when no user is set', () => {
    const { result } = renderHook(() => useCurrentUser())
    expect(result.current).toBeNull()
  })

  it('returns user object after setUser', () => {
    const mockUser = { uid: 'u2', email: 'b@c.com', displayName: 'Bob' }
    act(() => { useAuthStore.getState().setUser(mockUser) })
    const { result } = renderHook(() => useCurrentUser())
    expect(result.current).toEqual(mockUser)
  })
})

describe('useAuthLoading', () => {
  it('returns true on initial state', () => {
    const { result } = renderHook(() => useAuthLoading())
    expect(result.current).toBe(true)
  })

  it('returns false after auth resolves', () => {
    act(() => { useAuthStore.getState().clearUser() })
    const { result } = renderHook(() => useAuthLoading())
    expect(result.current).toBe(false)
  })
})