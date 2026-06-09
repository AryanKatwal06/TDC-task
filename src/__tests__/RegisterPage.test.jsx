import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import RegisterPage from '@/pages/RegisterPage'
import useAuthStore from '@/store/authStore'

// Mock the sign up function
vi.mock('@/firebase/auth', () => ({
  signUp: vi.fn(),
  subscribeToAuthChanges: vi.fn(() => vi.fn()),
}))

import { signUp } from '@/firebase/auth'

function renderRegister(initialRoute = '/register') {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<div>Dashboard Mock</div>} />
      </Routes>
    </MemoryRouter>
  )
}

describe('RegisterPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useAuthStore.setState({ user: null, loading: false })
  })

  it('renders the form correctly', () => {
    renderRegister()
    expect(screen.getByRole('heading', { name: /create an account/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  it('redirects to dashboard if already authenticated', () => {
    useAuthStore.setState({ user: { uid: '123' }, loading: false })
    renderRegister()
    expect(screen.getByText('Dashboard Mock')).toBeInTheDocument()
  })

  it('disables submit button if fields are empty', () => {
    renderRegister()
    const btn = screen.getByRole('button', { name: /sign up/i })
    expect(btn).toBeDisabled()
  })

  it('shows error if passwords do not match', async () => {
    const user = userEvent.setup()
    renderRegister()
    
    await user.type(screen.getByLabelText(/full name/i), 'Test User')
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password456')
    
    const btn = screen.getByRole('button', { name: /sign up/i })
    expect(btn).not.toBeDisabled()
    
    await user.click(btn)
    
    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument()
    expect(signUp).not.toHaveBeenCalled()
  })

  it('calls signUp and redirects on success', async () => {
    const user = userEvent.setup()
    signUp.mockResolvedValueOnce({ uid: 'new-uid' })
    renderRegister()
    
    await user.type(screen.getByLabelText(/full name/i), 'Test User')
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    
    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith('test@example.com', 'password123', 'Test User')
      expect(screen.getByText('Dashboard Mock')).toBeInTheDocument()
    })
  })

  it('shows error if signUp fails', async () => {
    const user = userEvent.setup()
    signUp.mockRejectedValueOnce({ code: 'auth/email-already-in-use' })
    renderRegister()
    
    await user.type(screen.getByLabelText(/full name/i), 'Test User')
    await user.type(screen.getByLabelText(/email address/i), 'exist@example.com')
    await user.type(screen.getByLabelText(/^password/i), 'password123')
    await user.type(screen.getByLabelText(/confirm password/i), 'password123')
    
    await user.click(screen.getByRole('button', { name: /sign up/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/account already exists/i)).toBeInTheDocument()
    })
  })
})
