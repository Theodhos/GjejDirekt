import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const requiredFirebaseVars = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
] as const;

for (const key of requiredFirebaseVars) {
  if (!process.env[key]) {
    throw new Error(`Missing Firebase env variable: ${key}`);
  }
}

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const auth = firebaseAuth;

export async function initFirebaseAnalytics() {
  if (typeof window === "undefined") return null;
  const supported = await isSupported();
  if (!supported) return null;
  return getAnalytics(firebaseApp);
}
