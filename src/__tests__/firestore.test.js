import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the firebase modules
vi.mock('firebase/firestore', () => ({
  collection:      vi.fn(() => ({})),
  doc:             vi.fn(() => ({})),
  getDocs:         vi.fn(),
  getDoc:          vi.fn(),
  addDoc:          vi.fn(),
  updateDoc:       vi.fn(),
  arrayUnion:      vi.fn((v) => v),
  query:           vi.fn((...args) => args),
  where:           vi.fn(),
  orderBy:         vi.fn(),
  serverTimestamp: vi.fn(() => 'SERVER_TIMESTAMP'),
  Timestamp:       { fromDate: vi.fn() },
}))

vi.mock('@/firebase/config', () => ({ db: {}, auth: {} }))

import { getDocs, getDoc, updateDoc, addDoc } from 'firebase/firestore'
import {
  fetchClientsForMatchmaker,
  fetchClientById,
  addNoteToClient,
  updateClientStatus,
} from '@/firebase/firestore'

beforeEach(() => { vi.clearAllMocks() })

describe('fetchClientsForMatchmaker', () => {
  it('maps Firestore docs to objects with id field', async () => {
    getDocs.mockResolvedValueOnce({
      docs: [
        { id: 'c1', data: () => ({ personal: { firstName: 'Arjun' } }) },
        { id: 'c2', data: () => ({ personal: { firstName: 'Priya' } }) },
      ],
    })
    const result = await fetchClientsForMatchmaker('uid123')
    expect(result).toHaveLength(2)
    expect(result[0]).toMatchObject({ id: 'c1', personal: { firstName: 'Arjun' } })
    expect(result[1]).toMatchObject({ id: 'c2', personal: { firstName: 'Priya' } })
  })

  it('returns empty array when no clients exist', async () => {
    getDocs.mockResolvedValueOnce({ docs: [] })
    const result = await fetchClientsForMatchmaker('uid123')
    expect(result).toEqual([])
  })
})

describe('fetchClientById', () => {
  it('returns client object when document exists', async () => {
    getDoc.mockResolvedValueOnce({
      exists: () => true,
      id:     'c1',
      data:   () => ({ statusTag: 'Active' }),
    })
    const result = await fetchClientById('c1')
    expect(result).toEqual({ id: 'c1', statusTag: 'Active' })
  })

  it('returns null when document does not exist', async () => {
    getDoc.mockResolvedValueOnce({ exists: () => false })
    const result = await fetchClientById('nonexistent')
    expect(result).toBeNull()
  })
})

describe('addNoteToClient', () => {
  it('calls updateDoc with arrayUnion on the notes field', async () => {
    updateDoc.mockResolvedValueOnce(undefined)
    const note = { id: 'n1', text: 'Test', createdAt: new Date().toISOString() }
    await addNoteToClient('c1', note)
    expect(updateDoc).toHaveBeenCalledTimes(1)
    const updateArg = updateDoc.mock.calls[0][1]
    expect(updateArg).toHaveProperty('notes')
    expect(updateArg).toHaveProperty('updatedAt')
  })
})

describe('updateClientStatus', () => {
  it('calls updateDoc with the new statusTag', async () => {
    updateDoc.mockResolvedValueOnce(undefined)
    await updateClientStatus('c1', 'Matched')
    expect(updateDoc).toHaveBeenCalledTimes(1)
    const updateArg = updateDoc.mock.calls[0][1]
    expect(updateArg.statusTag).toBe('Matched')
  })
})