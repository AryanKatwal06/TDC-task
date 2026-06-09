import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { auth } from './config'

/**
 * Creates a new matchmaker account and sets their display name.
 */
export async function signUp(email, password, displayName) {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  if (displayName) {
    await updateProfile(credential.user, { displayName })
  }
  return credential.user
}

/**
 * Signs in a matchmaker with email and password.
 * Throws a Firebase AuthError on failure — callers handle error display.
 */
export async function signIn(email, password) {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

/**
 * Signs out the current matchmaker and clears the Firebase session.
 */
export async function signOut() {
  await firebaseSignOut(auth)
}

/**
 * Subscribes to Firebase auth state changes.
 * Returns the unsubscribe function — must be called on component unmount.
 */
export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, callback)
}