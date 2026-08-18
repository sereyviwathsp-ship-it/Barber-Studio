# Setup Guide

## 1. Prerequisites

- Node.js 18+ and npm
- A Firebase project (free Spark plan is enough for dev)

## 2. Install dependencies

```bash
cd barber-studio
npm install
```

## 3. Configure Firebase

1. Go to the [Firebase console](https://console.firebase.google.com/), create a project.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Create a **Cloud Firestore** database (start in production mode; rules are provided in `firestore.rules`).
4. In **Project settings → General → Your apps**, add a Web app and copy the config values.
5. Copy `.env.example` to `.env.local` and paste the values in:

```bash
cp .env.example .env.local
```

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## 4. Deploy Firestore security rules

Using the Firebase CLI:

```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # point it at this repo's firestore.rules
firebase deploy --only firestore:rules
```

Or paste the contents of `firestore.rules` directly into
**Firestore → Rules** in the console and click Publish.

## 5. Firestore data model

| Collection  | Purpose | Who writes |
|---|---|---|
| `users/{uid}` | Lightweight profile (name, email) | Owning user, on sign-up |
| `admins/{uid}` | Presence of a doc marks the user as admin | Console / Admin SDK only |
| `services/{id}` | Public service menu (name, price, duration) | Admins |
| `bookings/{id}` | Reservation + `payment` sub-object (50/50 split) | Owning user creates; admin updates status/balance |
| `questions/{id}` | Public FAQ submissions | Any signed-in user creates; admin answers |

## 6. Grant yourself admin access

Admin status is determined purely by the existence of a document at
`admins/{yourUid}` — content doesn't matter (an empty doc is enough).

1. Sign up in the app normally to get a Firebase Auth UID (find it under
   **Authentication → Users** in the console, or in `users/{uid}` in Firestore).
2. In **Firestore → Data**, create a document in a new `admins` collection
   with that UID as the document ID. Any field (e.g. `{"grantedAt": "..."}`)
   or an empty doc both work.
3. Sign out and back in — the app will now show the **Admin** nav link and
   unlock `/admin`.

There is intentionally no self-service "become admin" button in the app —
this must always be done out-of-band by someone who already has console
access, per the security model in `firestore.rules`.

## 7. Seed the service menu (optional)

The app falls back to a built-in default menu if `services` is empty, so
this step is optional for a demo. To manage it for real, add documents to
`services` with shape:

```json
{ "name": "Signature Haircut & Styling", "desc": "...", "price": 25, "duration": "45 mins" }
```

## 8. Run locally

```bash
npm run dev
```

## 9. Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## 10. Payments — read this before going live

The card deposit flow in this repo is powered by a **stub** PaymentService
(`src/services/PaymentService.ts`). It never contacts a real payment
processor. See `docs/STRIPE_INTEGRATION.md` for exactly what's required to
replace it with real Stripe payments before accepting real money.
