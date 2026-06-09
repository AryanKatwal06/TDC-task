import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Firebase entirely — tests must not make real network calls
vi.mock('@/firebase/config', () => ({
  auth: {},
  db:   {},
  default: {},
}))

vi.mock('@/firebase/auth', () => ({
  signIn:                   vi.fn(),
  signOut:                  vi.fn(),
  subscribeToAuthChanges:   vi.fn(() => vi.fn()), // returns unsubscribe fn
}))

// Reset all mocks between tests
beforeEach(() => {
  vi.clearAllMocks()
})