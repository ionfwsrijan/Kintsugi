import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, getStorage } from 'firebase/storage';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseConfigured = Object.values(config).every(Boolean);
const app = firebaseConfigured ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const firestore = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

if (app && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
  connectAuthEmulator(auth!, 'http://127.0.0.1:9099', { disableWarnings: true });
  connectFirestoreEmulator(firestore!, '127.0.0.1', 8081);
  connectStorageEmulator(storage!, '127.0.0.1', 9199);
}

export async function ensureSession(): Promise<User> {
  if (!auth) throw new Error('Firebase is not configured');
  if (auth.currentUser) return auth.currentUser;
  await signInAnonymously(auth);
  return new Promise((resolve, reject) => {
    const stop = onAuthStateChanged(auth, user => { if (user) { stop(); resolve(user); } }, reject);
  });
}
