// src/lib/firebase/config.ts
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
// import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// Ensure these environment variables are set in your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
// let firestore: Firestore | undefined;
// let storage: FirebaseStorage | undefined;

// Check if the API key is a placeholder or missing
const apiKeyIsPlaceholder = 
  !firebaseConfig.apiKey || 
  firebaseConfig.apiKey === "YOUR_API_KEY" || 
  firebaseConfig.apiKey === "FIREBASE_API_KEY_PLACEHOLDER"; // Add more known placeholders if necessary

if (!apiKeyIsPlaceholder) {
  if (!getApps().length) {
    try {
      app = initializeApp(firebaseConfig);
      if (app) {
        auth = getAuth(app);
        // firestore = getFirestore(app);
        // storage = getStorage(app);
      }
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      // app, auth, firestore, storage will remain undefined
    }
  } else {
    app = getApps()[0];
    if (app) {
       try {
        auth = getAuth(app);
        // firestore = getFirestore(app);
        // storage = getStorage(app);
      } catch (error) {
        console.error("Firebase getAuth (or other services) failed on existing app:", error);
      }
    }
  }
} else {
  console.warn(
    "Firebase API key is a placeholder or not provided. " +
    "Firebase services (Auth, Firestore, Storage) will not be initialized. " +
    "The application will rely on mock data and services where available."
  );
}

export { app, auth /*, firestore, storage */ };
