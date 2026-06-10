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

// Firestore doesn't include doc IDs in data() — we merge them here.
export async function fetchClientsForMatchmaker(matchmakerUid) {
  const q = query(
    collection(db, 'clients'),
    where('assignedMatchmakerId', '==', matchmakerUid),
    orderBy('createdAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export function subscribeToClientsForMatchmaker(matchmakerUid, callback, onError) {
  const q = query(
    collection(db, 'clients'),
    where('assignedMatchmakerId', '==', matchmakerUid),
    orderBy('createdAt', 'desc')
  )
  return onSnapshot(q, (snapshot) => {
    const clients = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    callback(clients, snapshot.metadata.fromCache)
  }, onError)
}

export async function fetchClientById(clientId) {
  const ref      = doc(db, 'clients', clientId)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) return null
  return { id: snapshot.id, ...snapshot.data() }
}

export async function updateClientStatus(clientId, status) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    statusTag: status,
    updatedAt: serverTimestamp(),
  })
}

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

export async function updateClient(clientId, updates) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// Uses arrayUnion so it is safe to call concurrently.
export async function addNoteToClient(clientId, note) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    notes:     arrayUnion(note),
    updatedAt: serverTimestamp(),
  })
}

export async function markMatchAsSent(clientId, profileId) {
  const ref = doc(db, 'clients', clientId)
  await updateDoc(ref, {
    sentMatches: arrayUnion(profileId),
    updatedAt:   serverTimestamp(),
  })
}

// ─── Pool (matching pool of dummy profiles) ───────────────────

// Returns static JSON to save Firestore read cost and improve speed.
export async function fetchPoolProfiles() {
  const { default: profiles } = await import('@/data/profiles.js')
  return profiles
}

// ─── Seeding (dev/admin only) ─────────────────────────────────

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