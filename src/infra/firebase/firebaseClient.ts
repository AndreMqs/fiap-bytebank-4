// src/infra/firebase/firebaseClient.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'
import { getAuth, type Auth } from 'firebase/auth'

// Se NÃO tiver API key OU se VITE_FIREBASE_DISABLED === 'true',
// consideramos o Firebase DESLIGADO.
const hasConfig = !!import.meta.env.VITE_FIREBASE_API_KEY
const forcedDisabled = import.meta.env.VITE_FIREBASE_DISABLED === 'true'

export const firebaseEnabled = hasConfig && !forcedDisabled

let app: FirebaseApp | null = null
let auth: Auth | null = null

if (firebaseEnabled) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  }

  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApps()[0]!
  }

  auth = getAuth(app)
} else {
  console.warn(
    '%cFirebase desabilitado (sem configuração ou VITE_FIREBASE_DISABLED=true).',
    'color: orange; font-weight: bold'
  )
}

export { app, auth }
