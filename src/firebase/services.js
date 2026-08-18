import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from './config'

/**
 * Loads the service menu from Firestore's `services` collection.
 * Returns an empty array on failure or if the collection is empty, so
 * callers can fall back to a built-in default menu (see pages/Booking.jsx).
 */
export async function loadServices() {
  try {
    const snap = await getDocs(query(collection(db, 'services'), orderBy('price', 'asc')))
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  } catch {
    return []
  }
}
