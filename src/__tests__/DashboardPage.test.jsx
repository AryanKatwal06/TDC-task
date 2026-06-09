import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import DashboardPage  from '@/pages/DashboardPage'
import useClientStore from '@/store/clientStore'
import useAuthStore   from '@/store/authStore'
import useUiStore     from '@/store/uiStore'

// Mock Firestore — DashboardPage triggers a fetch on mount
vi.mock('@/firebase/firestore', () => ({
  fetchClientsForMatchmaker: vi.fn(),
}))

vi.mock('@/firebase/auth', () => ({
  subscribeToAuthChanges: vi.fn(() => vi.fn()),
  signOut: vi.fn(),
}))

import { fetchClientsForMatchmaker } from '@/firebase/firestore'

const MOCK_CLIENTS = [
  { id: 'c1', statusTag: 'Active',  createdAt: new Date().toISOString(),
    personal: { firstName: 'Arjun', lastName: 'Sharma', city: 'Mumbai', dob: '1993-04-15', maritalStatus: 'Never Married', nriStatus: false },
    professional: { designation: 'Engineer', company: 'Google', annualIncomeLakh: 42 },
    notes: [], sentMatches: [],
  },
  { id: 'c2', statusTag: 'Matched', createdAt: new Date().toISOString(),
    personal: { firstName: 'Priya', lastName: 'Mehta', city: 'Delhi', dob: '1996-08-22', maritalStatus: 'Never Married', nriStatus: false },
    professional: { designation: 'Consultant', company: 'Deloitte', annualIncomeLakh: 22 },
    notes: [], sentMatches: [],
  },
]

function renderDashboard() {
  return render(
    <MemoryRouter initialEntries={['/dashboard']}>
      <Routes>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/clients/:clientId" element={<div>Client Detail</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  useAuthStore.setState({ user: { uid: 'uid1', email: 'a@b.com', displayName: 'Test' }, loading: false, initialized: true })
  useClientStore.setState({ clients: [], loading: false, error: null })
  useUiStore.setState({ searchQuery: '', statusFilter: 'All', sidebarOpen: false })
  vi.clearAllMocks()
})

describe('DashboardPage — loading state', () => {
  it('shows skeleton rows while fetching', () => {
    fetchClientsForMatchmaker.mockImplementation(() => new Promise(() => {})) // never resolves
    useClientStore.setState({ loading: true })
    renderDashboard()
    // Skeleton rows are rendered — test by their aria role or class
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })
})

describe('DashboardPage — success state', () => {
  beforeEach(() => {
    useClientStore.setState({ clients: MOCK_CLIENTS, loading: false, error: null })
  })

  it('renders the page heading', () => {
    renderDashboard()
    expect(screen.getByRole('heading', { name: /your clients/i })).toBeInTheDocument()
  })

  it('renders all client names', () => {
    renderDashboard()
    expect(screen.getByText(/Arjun Sharma/)).toBeInTheDocument()
    expect(screen.getByText(/Priya Mehta/)).toBeInTheDocument()
  })

  it('renders correct stats', () => {
    renderDashboard()
    // Total clients stat
    const twos = screen.getAllByText('2')
    expect(twos.length).toBeGreaterThan(0)
  })

  it('navigates to client detail on row click', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await user.click(screen.getByLabelText(/view profile for arjun sharma/i))
    await waitFor(() => {
      expect(screen.getByText('Client Detail')).toBeInTheDocument()
    })
  })
})

describe('DashboardPage — search', () => {
  beforeEach(() => {
    useClientStore.setState({ clients: MOCK_CLIENTS, loading: false, error: null })
  })

  it('filters by name search', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await user.type(screen.getByLabelText(/search clients/i), 'Arjun')
    expect(screen.getByText(/Arjun Sharma/)).toBeInTheDocument()
    expect(screen.queryByText(/Priya Mehta/)).not.toBeInTheDocument()
  })

  it('shows no-results empty state when search yields nothing', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await user.type(screen.getByLabelText(/search clients/i), 'zzznomatch')
    expect(screen.getByText(/no results found/i)).toBeInTheDocument()
  })
})

describe('DashboardPage — filter', () => {
  beforeEach(() => {
    useClientStore.setState({ clients: MOCK_CLIENTS, loading: false, error: null })
  })

  it('filters by status tag', async () => {
    const user = userEvent.setup()
    renderDashboard()
    await user.selectOptions(screen.getByLabelText(/filter by status/i), 'Active')
    expect(screen.getByText(/Arjun Sharma/)).toBeInTheDocument()
    expect(screen.queryByText(/Priya Mehta/)).not.toBeInTheDocument()
  })
})

describe('DashboardPage — error state', () => {
  it('shows error message and retry button', async () => {
    fetchClientsForMatchmaker.mockRejectedValue(new Error('Network error'))
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByText(/couldn't load clients/i)).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })
})