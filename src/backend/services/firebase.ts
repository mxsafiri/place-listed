// Import the functions you need from the SDKs you need
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Define a function to get Firebase config from environment variables
function getFirebaseConfig() {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
  };
}

// Initialize Firebase only on the client side
let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined') {
  try {
    const firebaseConfig = getFirebaseConfig();
    
    // Check if all required Firebase config values are present
    const requiredConfigKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missingKeys = requiredConfigKeys.filter(key => {
      return !firebaseConfig[key as keyof typeof firebaseConfig];
    });
    
    if (missingKeys.length > 0) {
      console.warn(`Missing Firebase config keys: ${missingKeys.join(', ')}`);
      // Use mock implementations if config is incomplete
      app = null;
      auth = null;
      db = null;
      storage = null;
    } else {
      // Initialize Firebase with complete config
      app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Use mock implementations on error
    app = null;
    auth = null;
    db = null;
    storage = null;
  }
}

export { app, auth, db, storage };
