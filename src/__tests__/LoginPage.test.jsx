import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor }  from '@testing-library/react'
import userEvent                    from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import LoginPage    from '@/pages/LoginPage'
import { signIn }   from '@/firebase/auth'
import useAuthStore from '@/store/authStore'

// Navigation capture helper
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, useNavigate: () => mockNavigate }
})

function renderLoginPage() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/dashboard" element={<div>Dashboard</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  useAuthStore.setState({ user: null, loading: false, initialized: true })
  vi.clearAllMocks()
})

describe('LoginPage — rendering', () => {
  it('renders the heading', () => {
    renderLoginPage()
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    renderLoginPage()
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument()
  })

  it('renders the sign in button', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  it('sign in button is disabled when fields are empty', () => {
    renderLoginPage()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeDisabled()
  })
})

describe('LoginPage — form interaction', () => {
  it('enables submit button when both fields are filled', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    'test@tdc.com')
    await user.type(screen.getByLabelText(/^password$/i), 'password123')
    expect(screen.getByRole('button', { name: /sign in/i })).not.toBeDisabled()
  })

  it('toggles password visibility on eye button click', async () => {
    const user = userEvent.setup()
    renderLoginPage()
    const passwordInput = screen.getByLabelText(/^password$/i)
    expect(passwordInput).toHaveAttribute('type', 'password')
    await user.click(screen.getByLabelText(/show password/i))
    expect(passwordInput).toHaveAttribute('type', 'text')
    await user.click(screen.getByLabelText(/hide password/i))
    expect(passwordInput).toHaveAttribute('type', 'password')
  })
})

describe('LoginPage — submission', () => {
  it('calls signIn with trimmed email and password on submit', async () => {
    signIn.mockResolvedValueOnce({ uid: 'u1' })
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    '  test@tdc.com  ')
    await user.type(screen.getByLabelText(/^password$/i), 'secret')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    expect(signIn).toHaveBeenCalledWith('test@tdc.com', 'secret')
  })

  it('navigates to /dashboard on successful login', async () => {
    signIn.mockResolvedValueOnce({ uid: 'u1' })
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    'test@tdc.com')
    await user.type(screen.getByLabelText(/^password$/i), 'pass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })

  it('shows human-readable error on wrong password', async () => {
    signIn.mockRejectedValueOnce({ code: 'auth/wrong-password' })
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    'test@tdc.com')
    await user.type(screen.getByLabelText(/^password$/i), 'wrongpass')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/incorrect password/i)
    })
  })

  it('shows fallback error for unknown error codes', async () => {
    signIn.mockRejectedValueOnce({ code: 'auth/unknown-code' })
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    'a@b.com')
    await user.type(screen.getByLabelText(/^password$/i), 'p')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i)
    })
  })

  it('clears error on new submission attempt', async () => {
    signIn.mockRejectedValueOnce({ code: 'auth/wrong-password' })
    signIn.mockResolvedValueOnce({ uid: 'u1' })
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    'a@b.com')
    await user.type(screen.getByLabelText(/^password$/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.queryByRole('alert')).not.toBeInTheDocument())
  })

  it('dismisses error when X button is clicked', async () => {
    signIn.mockRejectedValueOnce({ code: 'auth/invalid-credential' })
    const user = userEvent.setup()
    renderLoginPage()
    await user.type(screen.getByLabelText(/email/i),    'a@b.com')
    await user.type(screen.getByLabelText(/^password$/i), 'p')
    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument())
    await user.click(screen.getByLabelText(/dismiss error/i))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('redirects to /dashboard if user is already logged in', async () => {
    useAuthStore.setState({
      user:    { uid: 'u1', email: 'a@b.com', displayName: 'Alice' },
      loading: false,
      initialized: true,
    })
    renderLoginPage()
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true })
    })
  })
})