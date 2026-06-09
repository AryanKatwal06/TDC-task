import { describe, it, expect, beforeEach } from 'vitest'
import useClientStore from '@/store/clientStore'

const MOCK_CLIENTS = [
  { id: 'c1', statusTag: 'Active',  personal: { firstName: 'Arjun',  lastName: 'Sharma' }, createdAt: new Date().toISOString(), notes: [] },
  { id: 'c2', statusTag: 'Matched', personal: { firstName: 'Priya',  lastName: 'Mehta'  }, createdAt: new Date().toISOString(), notes: [] },
  { id: 'c3', statusTag: 'New',     personal: { firstName: 'Rohit',  lastName: 'Verma'  }, createdAt: new Date().toISOString(), notes: [] },
]

beforeEach(() => {
  useClientStore.setState({ clients: [], selectedClientId: null, loading: false, error: null })
})

describe('clientStore — setClients', () => {
  it('sets the clients array', () => {
    useClientStore.getState().setClients(MOCK_CLIENTS)
    expect(useClientStore.getState().clients).toHaveLength(3)
  })

  it('sets loading to false', () => {
    useClientStore.setState({ loading: true })
    useClientStore.getState().setClients(MOCK_CLIENTS)
    expect(useClientStore.getState().loading).toBe(false)
  })

  it('clears any existing error', () => {
    useClientStore.setState({ error: 'previous error' })
    useClientStore.getState().setClients(MOCK_CLIENTS)
    expect(useClientStore.getState().error).toBeNull()
  })
})

describe('clientStore — setError', () => {
  it('sets the error message', () => {
    useClientStore.getState().setError('Network failed')
    expect(useClientStore.getState().error).toBe('Network failed')
  })

  it('sets loading to false when error occurs', () => {
    useClientStore.setState({ loading: true })
    useClientStore.getState().setError('Oops')
    expect(useClientStore.getState().loading).toBe(false)
  })
})

describe('clientStore — updateClientLocally', () => {
  it('merges a partial update into the matching client', () => {
    useClientStore.setState({ clients: MOCK_CLIENTS })
    const newNote = { id: 'n1', text: 'Test note', createdAt: new Date().toISOString() }
    useClientStore.getState().updateClientLocally('c1', { notes: [newNote] })
    const updated = useClientStore.getState().clients.find((c) => c.id === 'c1')
    expect(updated.notes).toHaveLength(1)
    expect(updated.notes[0].text).toBe('Test note')
  })

  it('does not modify other clients', () => {
    useClientStore.setState({ clients: MOCK_CLIENTS })
    useClientStore.getState().updateClientLocally('c1', { statusTag: 'Matched' })
    const c2 = useClientStore.getState().clients.find((c) => c.id === 'c2')
    expect(c2.statusTag).toBe('Matched') // c2 was already Matched — unchanged
    const c3 = useClientStore.getState().clients.find((c) => c.id === 'c3')
    expect(c3.statusTag).toBe('New') // c3 unchanged
  })
})

describe('clientStore — getSelectedClient', () => {
  it('returns null when no client is selected', () => {
    useClientStore.setState({ clients: MOCK_CLIENTS, selectedClientId: null })
    expect(useClientStore.getState().getSelectedClient()).toBeNull()
  })

  it('returns the matching client when selectedClientId is set', () => {
    useClientStore.setState({ clients: MOCK_CLIENTS, selectedClientId: 'c2' })
    const selected = useClientStore.getState().getSelectedClient()
    expect(selected.id).toBe('c2')
    expect(selected.personal.firstName).toBe('Priya')
  })

  it('returns null when selectedClientId does not match any client', () => {
    useClientStore.setState({ clients: MOCK_CLIENTS, selectedClientId: 'nonexistent' })
    expect(useClientStore.getState().getSelectedClient()).toBeNull()
  })
})

describe('clientStore — clearClients', () => {
  it('resets to empty state', () => {
    useClientStore.setState({ clients: MOCK_CLIENTS, selectedClientId: 'c1', error: 'err' })
    useClientStore.getState().clearClients()
    const s = useClientStore.getState()
    expect(s.clients).toHaveLength(0)
    expect(s.selectedClientId).toBeNull()
    expect(s.error).toBeNull()
  })
})