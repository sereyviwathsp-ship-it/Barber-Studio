# Barber Studio

A production-oriented React + Vite + TypeScript skeleton for a barbershop
booking site: browse services, book a chair with a 50% online card
deposit (50% due at the store), ask FAQs, and manage everything from an
admin dashboard gated by Firestore.

## Stack

- React 19 + TypeScript, Vite
- React Router for navigation
- Tailwind CSS v4 for styling
- Framer Motion for animation
- Firebase (Auth + Firestore)

## Project structure

```
src/
  components/       Shared UI (Navbar, MyBookings, AdminRoute, icons)
  pages/            Route-level screens (HomePage, Booking, FAQ, Auth)
  pages/admin/      Admin dashboard + tabs (Overview, Bookings, Questions)
  firebase/         Firebase init + all Firestore/Auth data access
  services/         PaymentService (stub) — see warnings inside
  hooks/            useAuth() context hook
  types/            Shared TypeScript domain types
docs/
  SETUP.md              Full setup walkthrough (Firebase, env, rules, admin grant)
  STRIPE_INTEGRATION.md What a REAL payment backend requires (not implemented here)
firestore.rules     Security rules enforcing the 50/50 split and admin gating
```

## Key features

- **Auth**: Firebase email/password sign-up/sign-in via `src/firebase/auth.ts`.
- **Booking flow**: pick services → pick a time slot → pay a 50% card
  deposit → confirmation showing the remaining 50% due in-store.
- **50/50 deposit model**: `src/firebase/bookings.ts#computeDepositSplit`
  computes the split; `firestore.rules` re-verifies it server-side so a
  tampered client can't record a fake amount.
- **Admin dashboard** (`/admin`): overview stats, booking management
  (mark balance paid in-store, complete/cancel), and FAQ question
  answering. Gated by the presence of a doc in the `admins` Firestore
  collection — see `docs/SETUP.md` §6 for how to grant access.
- **PaymentService stub**: `src/services/PaymentService.ts` is clearly
  documented as **not a real payment gateway**. It performs client-side
  card format validation and simulates a network round trip so the booking
  UX is fully functional for demos, but it never contacts Stripe or moves
  real money. See `docs/STRIPE_INTEGRATION.md` for the real integration plan.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Firebase project config
npm run dev
```

Full instructions, including Firestore rules deployment and granting admin
access, are in [`docs/SETUP.md`](./docs/SETUP.md).

## Building for production

```bash
npm run build
npm run preview
```

## ⚠️ Before accepting real payments

Do not deploy this as-is and expect real charges to work. Read
[`docs/STRIPE_INTEGRATION.md`](./docs/STRIPE_INTEGRATION.md) — a server-side
component (Stripe secret key, PaymentIntents, webhooks) is required and is
intentionally not included here.
