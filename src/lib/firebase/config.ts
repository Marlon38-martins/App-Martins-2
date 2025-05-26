
// src/lib/firebase/config.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// IMPORTANT:
// 1. Create a `.env.local` file in the root of your project.
// 2. Add your Firebase project configuration to this file. Example:
//    NEXT_PUBLIC_FIREBASE_API_KEY="YOUR_API_KEY"
//    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="YOUR_AUTH_DOMAIN"
//    NEXT_PUBLIC_FIREBASE_PROJECT_ID="YOUR_PROJECT_ID"
//    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="YOUR_STORAGE_BUCKET"
//    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID"
//    NEXT_PUBLIC_FIREBASE_APP_ID="YOUR_APP_ID"
//    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID="YOUR_MEASUREMENT_ID" // Optional
//
// Replace "YOUR_..." with your actual Firebase project values.
// These NEXT_PUBLIC_ prefixed variables will be automatically available in your frontend code.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID, // Optional
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let firestore: Firestore | undefined;
let storage: FirebaseStorage | undefined;

const apiKeyIsProvidedAndSeemsValid =
  firebaseConfig.apiKey &&
  typeof firebaseConfig.apiKey === 'string' &&
  firebaseConfig.apiKey.trim() !== "" &&
  !firebaseConfig.apiKey.startsWith("YOUR_") &&
  !firebaseConfig.apiKey.includes("PLACEHOLDER");

if (apiKeyIsProvidedAndSeemsValid) {
  if (!getApps().length) {
    try {
      console.log("Attempting Firebase initialization...");
      app = initializeApp(firebaseConfig);
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
      console.log("Firebase App, Auth, Firestore, and Storage initialized successfully.");
    } catch (error: any) {
      console.error("Firebase initialization failed:", error.message);
      app = undefined;
      auth = undefined;
      firestore = undefined;
      storage = undefined;
    }
  } else {
    app = getApps()[0];
    console.log("Using existing Firebase App instance.");
    try {
      auth = getAuth(app);
      firestore = getFirestore(app);
      storage = getStorage(app);
      console.log("Firebase Auth, Firestore, and Storage services obtained from existing app.");
    } catch (error: any) {
        console.error("Firebase getAuth/Firestore/Storage failed on existing app:", error.message);
        auth = undefined;
        firestore = undefined;
        storage = undefined;
    }
  }
} else {
  console.warn(
    "Firebase API key is missing, invalid, or a placeholder in .env.local. " +
    "Firebase services (Auth, Firestore, Storage) will NOT be initialized. " +
    "The application will rely on mock data and services."
  );
  app = undefined;
  auth = undefined;
  firestore = undefined;
  storage = undefined;
}

export { app, auth, firestore, storage };
