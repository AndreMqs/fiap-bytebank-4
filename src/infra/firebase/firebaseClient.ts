import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyD9EaiHXQxbwr7_ON332Ew2fWIGjzhsYZE",
  authDomain: "fiap-bytebank-mobile.firebaseapp.com",
  projectId: "fiap-bytebank-mobile",
  storageBucket: "fiap-bytebank-mobile.firebasestorage.app",
  messagingSenderId: "558027301391",
  appId: "1:558027301391:web:774e08f9c454b17d02f97a",
  measurementId: "G-3LCN9E2ZP2"
}

const forcedDisabled = import.meta.env.VITE_FIREBASE_DISABLED === 'true'

export const firebaseEnabled = !forcedDisabled

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

if (firebaseEnabled) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]!
  }

  auth = getAuth(app)
  db = getFirestore(app)
} else {
  console.warn(
    '%cFirebase desabilitado (VITE_FIREBASE_DISABLED=true).',
    'color: orange; font-weight: bold'
  )
}

export { app, auth, db }
