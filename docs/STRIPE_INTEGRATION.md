# Stripe Integration Requirements (Not Implemented Here)

`src/services/PaymentService.ts` is a **stub**. It validates card-shaped
input client-side and simulates a charge, but it never moves money and
never talks to Stripe or any processor. This document specifies what a
real integration needs. **None of it is built in this repo.**

## Why a backend is mandatory

Stripe secret keys must never be present in frontend code, and raw card
numbers must never be handled by your own JavaScript if you want to stay
out of full PCI-DSS scope. That means:

- A **server** (Cloud Functions, a small Node/Express service, etc.) that
  holds the Stripe **secret key** and creates `PaymentIntent`s.
- The **frontend** switches from raw `<input>` fields to **Stripe.js +
  Stripe Elements** (or Payment Element), so card data is tokenized in an
  iframe Stripe controls — it never reaches your server or your database.

## Required backend endpoints

Build these as Firebase Cloud Functions (recommended, keeps everything in
one Firebase project) or any small server you already run.

### `POST /createDepositIntent`
- Input: `{ bookingDraftId, amountCents, currency }` (amount computed
  server-side from the service prices — never trust a client-supplied
  amount).
- Action: `stripe.paymentIntents.create({ amount, currency, capture_method: 'automatic', metadata: { bookingDraftId } })`
- Output: `{ clientSecret }` for Stripe Elements to confirm on the client.

### `POST /stripeWebhook`
- Verifies the Stripe webhook signature (`STRIPE_WEBHOOK_SECRET`).
- On `payment_intent.succeeded`: mark the booking's `payment.status =
  'deposit_paid'`, store the real `paymentIntentId`, and only *then* write
  the booking document (or flip a `pending` doc to confirmed). This makes
  the webhook — not the client — the source of truth for "did the deposit
  really land."
- On `payment_intent.payment_failed`: mark `payment.status = 'failed'` and
  never confirm the reservation.

### `POST /refundDeposit` (admin-only, for cancellations)
- Calls `stripe.refunds.create({ payment_intent })`.
- Should require an authenticated admin (verify Firebase ID token +
  `admins/{uid}` doc server-side too — don't just trust the client's claim).

## Environment variables (server-side only, never in Vite `.env`)

```
STRIPE_SECRET_KEY=sk_live_or_sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

The **publishable key** (`pk_live_...` / `pk_test_...`) is the only Stripe
key allowed in frontend code, passed to `loadStripe()`.

## Frontend changes needed

1. `npm install @stripe/stripe-js @stripe/react-stripe-js`
2. Replace the manual card number/expiry/CVC inputs in `src/pages/Booking.tsx`
   with a `<PaymentElement />` inside an `<Elements>` provider, initialized
   with the `clientSecret` from `/createDepositIntent`.
3. Replace `src/services/PaymentService.ts`'s `StubPaymentService` with a
   `StripePaymentService` whose `chargeDeposit()`:
   - calls `/createDepositIntent` on your backend,
   - calls `stripe.confirmPayment()` with the returned `clientSecret`,
   - returns `{ success, paymentIntentId, cardDisplay }` in the same shape
     the rest of the app already expects (the `IPaymentService` interface
     is designed so this swap requires no changes to `bookings.ts` or the
     UI beyond the card-entry widget itself).
4. Booking documents should only be written after the webhook confirms
   success (move `saveBooking`'s Firestore write into the webhook handler,
   or use a `pending` booking doc created before payment and finalized by
   the webhook).

## Reconciling with the 50/50 model

- Deposit (50%) → captured immediately via the `PaymentIntent` above.
- Balance (50%) → stays "due at store," collected by staff via the
  existing POS (cash/KHQR/ABA) — no Stripe involvement needed unless you
  later want in-store card terminals synced back into Firestore too.

## Testing

Use Stripe's test mode and [test cards](https://stripe.com/docs/testing)
(e.g. `4242 4242 4242 4242`) against `sk_test_...` before ever touching
live keys. Run `stripe listen --forward-to localhost:5001/.../stripeWebhook`
during local development to receive webhook events.
