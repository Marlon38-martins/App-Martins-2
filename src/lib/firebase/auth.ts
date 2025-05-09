// src/lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged as firebaseOnAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User as FirebaseUser, // Renaming to avoid conflict with our User type
  type AuthError,
} from 'firebase/auth';
import { auth } from './config'; // Your Firebase app initialization
import type { User } from '@/types/user'; // Your application's User type

export async function signUpWithEmailAndPassword(email: string, password: string): Promise<{ user: FirebaseUser | null; error: AuthError | null }> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

export async function signInWithEmail(email: string, password: string): Promise<{ user: FirebaseUser | null; error: AuthError | null }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

export async function signInWithGoogle(): Promise<{ user: FirebaseUser | null; error: AuthError | null }> {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error as AuthError };
  }
}

export async function signOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out: ", error);
    // Handle error appropriately
  }
}

/**
 * Listens for auth state changes and maps FirebaseUser to your app's User type.
 * @param callback - Function to call with the app User object or null, and any AuthError.
 * @returns Unsubscribe function.
 */
export function onAuthStateChanged(callback: (user: User | null, error: AuthError | null) => void): () => void {
  return firebaseOnAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
    // This is the success observer
    if (firebaseUser) {
      const appUser: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        // You might fetch additional user profile data from Firestore here
      };
      callback(appUser, null);
    } else {
      callback(null, null);
    }
  }, (error: AuthError) => { // This is the error observer
    console.error("Firebase onAuthStateChanged error observer caught an error:", error);
    callback(null, error);
  });
}
