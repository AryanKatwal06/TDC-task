import { describe, it, expect } from 'vitest'
import { render, screen }       from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from '@/components/ProtectedRoute'
import useAuthStore   from '@/store/authStore'

function Wrapper({ initialPath = '/protected', children }) {
  return (
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login"     element={<div>Login Page</div>} />
        <Route path="/protected" element={children} />
      </Routes>
    </MemoryRouter>
  )
}

describe('ProtectedRoute', () => {
  it('shows loading spinner while auth is resolving', () => {
    useAuthStore.setState({ user: null, loading: true, initialized: false })
    render(
      <Wrapper>
        <ProtectedRoute><div>Secret</div></ProtectedRoute>
      </Wrapper>
    )
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('redirects to /login when unauthenticated and not loading', () => {
    useAuthStore.setState({ user: null, loading: false, initialized: true })
    render(
      <Wrapper>
        <ProtectedRoute><div>Secret</div></ProtectedRoute>
      </Wrapper>
    )
    expect(screen.getByText('Login Page')).toBeInTheDocument()
    expect(screen.queryByText('Secret')).not.toBeInTheDocument()
  })

  it('renders children when authenticated', () => {
    useAuthStore.setState({
      user:    { uid: 'u1', email: 'a@b.com', displayName: 'Alice' },
      loading: false,
      initialized: true,
    })
    render(
      <Wrapper>
        <ProtectedRoute><div>Secret</div></ProtectedRoute>
      </Wrapper>
    )
    expect(screen.getByText('Secret')).toBeInTheDocument()
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument()
  })
})