import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  onSnapshot
} from 'firebase/firestore'
import { db } from './config'

// ─── Clients ──────────────────────────────────────────────────

/**
 * Subscribes to all client documents assigned to a specific matchmaker.
 * Returns an unsubscribe function.
 */
export function subscribeToClients(matchmakerUid, onData, onError) {
  const q = query(
    collection(db, 'clients'),
    where('assignedMatchmakerId', '==', matchmakerUid),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(
    q,
    (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      onData(data)
    },
    (err) => {
      console.error(err)
      if (onError) onError(err)
    }
  )
}

/**
 * Fetches a single client document by its Firestore document ID.
 * Returns null if the document does not exist.
 */
export async function fetchClientById(clientId) {
  const ref      = doc(db, 'clients', clientId)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

/**
 * Updates the status tag of a client document.
 * Valid values: 'Active' | 'On Hold' | 'Matched' | 'Paused' | 'New'
 */
export async function updateClientStatus(clientId, status) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    statusTag: status,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Creates a new client document in Firestore.
 * Returns the newly created document with its generated ID.
 */
export async function createClient(matchmakerUid, clientData) {
  const col = collection(db, 'clients')
  const ref = await addDoc(col, {
    ...clientData,
    assignedMatchmakerId: matchmakerUid,
    statusTag:  clientData.statusTag ?? 'New',
    notes:      [],
    sentMatches:[],
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  })
  return { id: ref.id, ...clientData, assignedMatchmakerId: matchmakerUid }
}

/**
 * Updates editable fields on an existing client document.
 * Only updates the fields explicitly passed in — uses spread merge, not replace.
 */
export async function updateClient(clientId, updates) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Appends a note to a client's notes array in Firestore.
 * Uses arrayUnion so it is safe to call concurrently.
 *
 * Note shape:
 *   { id: string, text: string, createdAt: ISO string, createdBy: matchmakerUid }
 */
export async function addNoteToClient(clientId, note) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    notes:     arrayUnion(note),
    updatedAt: serverTimestamp(),
  })
}

/**
 * Records a sent match by pushing the profileId into the client's
 * sentMatches array. Used in Phase 3 by the Send Match flow.
 */
export async function markMatchAsSent(clientId, profileId) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    sentMatches: arrayUnion(profileId),
    updatedAt:   serverTimestamp(),
  })
}

// ─── Pool (matching pool of dummy profiles) ───────────────────

/**
 * Returns all pool profiles.
 * In Phase 2 this returns static JSON (fast, no Firestore read cost).
 * In a future phase this can be swapped to a Firestore query without
 * changing any of the callers — the interface stays identical.
 */
export async function fetchPoolProfiles() {
  const { default: profiles } = await import('@/data/profiles.js')
  return profiles
}

// ─── Seeding (dev/admin only) ─────────────────────────────────

/**
 * Seeds a matchmaker's client list into Firestore.
 * Intended to be called once from a browser console or a dev-only admin page.
 * Each client document gets the matchmakerUid injected before writing.
 */
export async function seedClientsForMatchmaker(matchmakerUid, clients) {
  const col = collection(db, 'clients')
  const writes = clients.map((client) =>
    addDoc(col, {
      ...client,
      assignedMatchmakerId: matchmakerUid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })
  )
  await Promise.all(writes)
}