/**
 * ============================================================================
 *  PAYMENT SERVICE — STUB / INTERFACE ONLY
 * ============================================================================
 *
 *  ⚠️  THIS IS NOT A REAL PAYMENT GATEWAY. ⚠️
 *
 *  Nothing in this file talks to Stripe, a bank, or any card network. It
 *  exists to define the contract the rest of the app relies on
 *  (`chargeDeposit`) and to let the booking flow be built, demoed, and
 *  tested end-to-end before real payments are wired up.
 *
 *  Card data typed into the booking form in this stub implementation is
 *  NEVER sent anywhere — it is validated with basic client-side checks
 *  (Luhn-ish length check, expiry format) purely for UX realism, then
 *  discarded. No PCI-scope data is persisted, logged, or transmitted.
 *
 *  DO NOT ship this stub to production. See docs/STRIPE_INTEGRATION.md for
 *  exactly what a real integration requires: a server-side backend that
 *  creates PaymentIntents with the Stripe secret key, and a client that
 *  uses Stripe.js / Stripe Elements so raw card numbers never touch this
 *  codebase at all.
 * ============================================================================
 */

/**
 * @typedef {{ cardNumber: string, expiry: string, cvc: string, nameOnCard: string }} CardDetails
 * @typedef {{ amount: number, currency: 'usd', card: CardDetails, description: string }} ChargeRequest
 * @typedef {{ success: boolean, paymentIntentId: string|null, cardDisplay: string|null, errorMessage?: string }} ChargeResult
 */

function luhnCheck(num) {
  const digits = num.replace(/\s+/g, '')
  if (!/^\d{12,19}$/.test(digits)) return false
  let sum = 0
  let shouldDouble = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = parseInt(digits[i], 10)
    if (shouldDouble) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    shouldDouble = !shouldDouble
  }
  return sum % 10 === 0
}

function detectBrand(num) {
  const digits = num.replace(/\s+/g, '')
  if (/^4/.test(digits)) return 'VISA'
  if (/^5[1-5]/.test(digits)) return 'MASTERCARD'
  if (/^3[47]/.test(digits)) return 'AMEX'
  return 'CARD'
}

/**
 * Stub implementation: performs light client-side validation, simulates
 * network latency, then "succeeds" for any well-formed card number that
 * passes a Luhn check. Nothing is charged. Nothing leaves the browser.
 *
 * @implements {{ chargeDeposit(request: ChargeRequest): Promise<ChargeResult> }}
 */
class StubPaymentService {
  async chargeDeposit(request) {
    const { card, amount } = request

    if (amount <= 0) {
      return { success: false, paymentIntentId: null, cardDisplay: null, errorMessage: 'Invalid amount.' }
    }

    const digits = card.cardNumber.replace(/\s+/g, '')
    if (!luhnCheck(digits)) {
      return {
        success: false,
        paymentIntentId: null,
        cardDisplay: null,
        errorMessage: 'Card number looks invalid. This is a demo form — try 4242 4242 4242 4242.',
      }
    }
    if (!/^\d{2}\/\d{2}$/.test(card.expiry)) {
      return { success: false, paymentIntentId: null, cardDisplay: null, errorMessage: 'Expiry must be MM/YY.' }
    }
    if (!/^\d{3,4}$/.test(card.cvc)) {
      return { success: false, paymentIntentId: null, cardDisplay: null, errorMessage: 'CVC must be 3–4 digits.' }
    }

    // Simulate a network round-trip so the UI's loading state is real.
    await new Promise((resolve) => setTimeout(resolve, 900))

    const last4 = digits.slice(-4)
    const brand = detectBrand(digits)

    return {
      success: true,
      paymentIntentId: `stub_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      cardDisplay: `${brand} •••• ${last4}`,
    }
  }
}

/**
 * Singleton used across the app. Replace this export with a real adapter
 * (calling your backend, which itself calls Stripe) when going live —
 * see docs/STRIPE_INTEGRATION.md.
 */
export const paymentService = new StubPaymentService()
