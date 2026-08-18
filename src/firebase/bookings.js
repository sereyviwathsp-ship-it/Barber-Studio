import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore'
import { db } from './config'
import { paymentService } from '../services/PaymentService'

/**
 * @typedef {{ name: string, phone: string, services: string[], time: string, total: number }} NewBookingInput
 */

/**
 * Computes the 50/50 split for a booking total.
 * Half is charged online as a card deposit at booking time; the remaining
 * half is due in person at the store on the day of the appointment.
 * Amounts are rounded to 2 decimal places to avoid floating point cents drift.
 */
export function computeDepositSplit(total) {
  const depositAmount = Math.round(total * 50) / 100
  const balanceDueAtStore = Math.round((total - depositAmount) * 100) / 100
  return { depositAmount, balanceDueAtStore }
}

/**
 * Creates a booking with a 50% online card deposit and 50% due at store.
 *
 * Flow:
 * 1. Compute the deposit/balance split.
 * 2. Charge the deposit via PaymentService (stub — see services/PaymentService.js).
 * 3. Persist the booking with payment status reflecting the charge result.
 *
 * Throws if the deposit charge fails; no booking document is written in that case,
 * so the UI can surface a retry without creating a dangling reservation.
 */
export async function saveBooking(user, input, cardDetails) {
  const { depositAmount, balanceDueAtStore } = computeDepositSplit(input.total)

  const chargeResult = await paymentService.chargeDeposit({
    amount: depositAmount,
    currency: 'usd',
    card: cardDetails,
    description: `Barber Studio deposit — ${input.services.join(', ')}`,
  })

  if (!chargeResult.success) {
    throw new Error(chargeResult.errorMessage || 'Deposit charge failed')
  }

  const payment = {
    totalAmount: input.total,
    depositAmount,
    balanceDueAtStore,
    status: 'deposit_paid',
    paymentIntentId: chargeResult.paymentIntentId,
    depositPaidAt: new Date().toISOString(),
    cardDisplay: chargeResult.cardDisplay ?? null,
  }

  const docRef = await addDoc(collection(db, 'bookings'), {
    userId: user.uid,
    name: input.name,
    phone: input.phone,
    services: input.services,
    time: input.time,
    total: input.total,
    payment,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  })

  return {
    id: docRef.id,
    userId: user.uid,
    name: input.name,
    phone: input.phone,
    services: input.services,
    time: input.time,
    total: input.total,
    payment,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
  }
}

/** Loads bookings belonging to a single user, newest first. */
export async function loadUserBookings(userId) {
  const snap = await getDocs(
    query(collection(db, 'bookings'), where('userId', '==', userId), orderBy('createdAt', 'desc')),
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/** Admin-only: loads every booking, newest first. Firestore rules must gate this to admins. */
export async function loadAllBookings() {
  const snap = await getDocs(query(collection(db, 'bookings'), orderBy('createdAt', 'desc')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/** Admin-only: marks the in-store balance as collected once the client pays at the counter. */
export async function markBalancePaidInStore(bookingId) {
  await updateDoc(doc(db, 'bookings', bookingId), {
    'payment.status': 'paid_in_full',
  })
}

/** Admin-only: updates booking status (e.g. completed, cancelled, no_show). */
export async function updateBookingStatus(bookingId, status) {
  await updateDoc(doc(db, 'bookings', bookingId), { status })
}
