import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD8nMXaHjbr28oHcpwOBRXXd8-327OWpeE",
  authDomain: "booking-ef543.firebaseapp.com",
  projectId: "booking-ef543",
  storageBucket: "booking-ef543.firebasestorage.app",
  messagingSenderId: "275267170910",
  appId: "1:275267170910:web:5787d36da9e7cfb23a7acf",
  measurementId: "G-6CYQVH1DKK"
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp);
