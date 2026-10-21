import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

function getResolvedConfig(): FirebaseConfig {
  // Option 1: Entire JSON in a single variable FIREBASE_CONFIG
  if (process.env.FIREBASE_CONFIG) {
    try {
      return JSON.parse(process.env.FIREBASE_CONFIG);
    } catch {
      console.warn("Could not parse FIREBASE_CONFIG json string");
    }
  }

  // Option 2: Standard granular environment variables
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  };
}

let cachedFirestore: Firestore | null = null;
let cachedApp: FirebaseApp | null = null;

export function isFirebaseConfigured(): boolean {
  const config = getResolvedConfig();
  return Boolean(config.apiKey && config.projectId);
}

export function getDbFirestore(): Firestore | null {
  if (!isFirebaseConfigured()) {
    return null;
  }

  if (cachedFirestore) {
    return cachedFirestore;
  }

  try {
    const config = getResolvedConfig();
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(config);
    cachedFirestore = getFirestore(cachedApp);
    return cachedFirestore;
  } catch (error) {
    console.error("Error initializing Firebase Firestore:", error);
    return null;
  }
}
