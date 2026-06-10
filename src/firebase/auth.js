import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'

export async function signUp(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }
  return credential.user
}

// No try/catch here — callers handle the Firebase AuthError to show UI feedback.
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function signOut() {
  await firebaseSignOut(auth)
}

// Returns the unsubscribe function — must be called on unmount, otherwise listeners stack up.
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}