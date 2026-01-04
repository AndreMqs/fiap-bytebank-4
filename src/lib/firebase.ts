// src/lib/firebase.ts
import { FirebaseApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD9EaiHXQxbwr7_ON332Ew2fWIGjzhsYZE",
  authDomain: "fiap-bytebank-mobile.firebaseapp.com",
  projectId: "fiap-bytebank-mobile",
  storageBucket: "fiap-bytebank-mobile.firebasestorage.app",
  messagingSenderId: "558027301391",
  appId: "1:558027301391:web:774e08f9c454b17d02f97a",
  measurementId: "G-3LCN9E2ZP2"
};

const app: FirebaseApp = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);