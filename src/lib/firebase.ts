import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

// Firebase configuration for project: tecnologiaweb-c6f60
export const defaultFirebaseConfig: FirebaseConfig = {
  apiKey: "AIzaSyAlBNHUYg6bOYXLPyKix3ldrbZKawe9_4Q",
  authDomain: "tecnologiaweb-c6f60.firebaseapp.com",
  projectId: "tecnologiaweb-c6f60",
  storageBucket: "tecnologiaweb-c6f60.firebasestorage.app",
  messagingSenderId: "421139405318",
  appId: "1:421139405318:web:7bc3505aa849de575dc187",
};

function getResolvedConfig(): FirebaseConfig {
  // Option 1: Entire JSON in FIREBASE_CONFIG
  if (process.env.FIREBASE_CONFIG) {
    try {
      return { ...defaultFirebaseConfig, ...JSON.parse(process.env.FIREBASE_CONFIG) };
    } catch {}
  }

  // Option 2: Environment variables or default credentials
  return {
    apiKey:
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
      process.env.FIREBASE_API_KEY ||
      defaultFirebaseConfig.apiKey,
    authDomain:
      process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
      process.env.FIREBASE_AUTH_DOMAIN ||
      defaultFirebaseConfig.authDomain,
    projectId:
      process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
      process.env.FIREBASE_PROJECT_ID ||
      defaultFirebaseConfig.projectId,
    storageBucket:
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
      process.env.FIREBASE_STORAGE_BUCKET ||
      defaultFirebaseConfig.storageBucket,
    messagingSenderId:
      process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
      process.env.FIREBASE_MESSAGING_SENDER_ID ||
      defaultFirebaseConfig.messagingSenderId,
    appId:
      process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
      process.env.FIREBASE_APP_ID ||
      defaultFirebaseConfig.appId,
  };
}

let cachedFirestore: Firestore | null = null;
let cachedApp: FirebaseApp | null = null;

export function isFirebaseConfigured(): boolean {
  const config = getResolvedConfig();
  return Boolean(config.apiKey && config.projectId);
}

export function getDbFirestore(): Firestore | null {
  if (cachedFirestore) {
    return cachedFirestore;
  }

  try {
    const config = getResolvedConfig();
    cachedApp = getApps().length > 0 ? getApp() : initializeApp(config);
    cachedFirestore = getFirestore(cachedApp);
    return cachedFirestore;
  } catch (error) {
    console.warn("Notice initializing Firebase Firestore:", error);
    return null;
  }
}
