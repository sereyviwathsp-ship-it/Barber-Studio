import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './config'

async function checkIsAdmin(uid) {
  try {
    const snap = await getDoc(doc(db, 'admins', uid))
    return snap.exists()
  } catch {
    return false
  }
}

function toAppUser(fbUser, isAdmin) {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Guest',
    isAdmin,
  }
}

export async function signUp(name, email, password) {
  const cred = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(cred.user, { displayName: name })
  await setDoc(doc(db, 'users', cred.user.uid), {
    name,
    email,
    createdAt: new Date().toISOString(),
  })
  return toAppUser(cred.user, false)
}

export async function signIn(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password)
  const isAdmin = await checkIsAdmin(cred.user.uid)
  return toAppUser(cred.user, isAdmin)
}

export async function signOut() {
  await firebaseSignOut(auth)
}

export function subscribeToAuthChanges(callback) {
  return onAuthStateChanged(auth, async (fbUser) => {
    if (!fbUser) {
      callback(null)
      return
    }
    const isAdmin = await checkIsAdmin(fbUser.uid)
    callback(toAppUser(fbUser, isAdmin))
  })
}