import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    config.apiKey &&
      config.authDomain &&
      config.projectId &&
      config.appId
  );
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseConfigured()) return null;
  if (app) return app;
  app = getApps().length === 0 ? initializeApp(config) : getApps()[0];
  return app;
}

export function getDb(): Firestore {
  const firebaseApp = getFirebaseApp();
  if (!firebaseApp) {
    throw new Error(
      "Firebase belum dikonfigurasi. Salin .env.local.example menjadi .env.local lalu isi kredensial dari Firebase Console."
    );
  }
  if (!db) db = getFirestore(firebaseApp);
  return db;
}
