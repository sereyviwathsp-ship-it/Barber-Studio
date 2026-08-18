/**
 * Shared domain shape reference for Barber Studio (JS — no compile-time types).
 *
 * AppUser: { uid, email, name, isAdmin? }
 * Service: { id, name, desc, price, duration }
 * PaymentStatus: 'pending' | 'deposit_paid' | 'paid_in_full' | 'failed' | 'refunded'
 * BookingPayment: {
 *   totalAmount, depositAmount, balanceDueAtStore, status,
 *   paymentIntentId, depositPaidAt, cardDisplay?
 * }
 * BookingStatus: 'confirmed' | 'cancelled' | 'completed' | 'no_show'
 * Booking: { id, userId, name, phone, services, time, total, payment, status, createdAt }
 * Question: { id, userId, name, text, answer?, createdAt }
 */
export {}
