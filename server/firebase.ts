import { applicationDefault, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';
import { getStorage } from 'firebase-admin/storage';
import { env } from './config.js';

const app = getApps()[0] ?? initializeApp({
  credential: applicationDefault(),
  projectId: env.GOOGLE_CLOUD_PROJECT,
  storageBucket: env.FIREBASE_STORAGE_BUCKET
});

export const auth = getAuth(app);
export const db = getFirestore(app);
export const bucket = getStorage(app).bucket();
export const messaging = getMessaging(app);
