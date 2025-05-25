
// src/hooks/use-auth-client.tsx
'use client';

import type { User, Subscription } from '@/types/user';
import { getCurrentUser as getMockCurrentUser, getMockUserSubscription, mockLogout } from '@/services/gramado-businesses';
import { auth } from '@/lib/firebase/config'; // Import the auth instance from Firebase config
import { onAuthStateChanged, signOut as firebaseSignOut, type User as FirebaseUser } from 'firebase/auth';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';


interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null; // Store the raw Firebase user if needed
  subscription: Subscription | null;
  loading: boolean;
  signInUser: (user: User, sub: Subscription) => void; // For mock sign-in
  signOutUser: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderClientProps {
  children: React.ReactNode;
}

export function AuthProviderClient({ children }: AuthProviderClientProps) {
  const [user, setUser] = useState<User | null>(null); // App's User type
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null); // Firebase's User type
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  const fetchMockSubscriptionForUser = useCallback(async (currentAppUser: User) => {
    try {
      const subDetails = await getMockUserSubscription(currentAppUser.id);
      setSubscription(subDetails);
    } catch (error) {
      console.warn("Error fetching mock subscription for user:", currentAppUser.email, error);
      setSubscription(null);
    }
  }, []);

  const loadMockAuthData = useCallback(async () => {
    console.log("AuthProvider: Attempting to load mock auth data...");
    setLoading(true);
    try {
      const mockAppUser = await getMockCurrentUser();
      setUser(mockAppUser);
      if (mockAppUser) {
        console.log("AuthProvider: Mock user loaded:", mockAppUser.email);
        await fetchMockSubscriptionForUser(mockAppUser);
        setIsAdmin(mockAppUser.email === 'admin@example.com');
      } else {
        console.log("AuthProvider: No mock user found in local storage.");
        setSubscription(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("AuthProvider: Error fetching mock auth data:", error);
      setUser(null);
      setSubscription(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
      console.log("AuthProvider: Mock auth data loading finished.");
    }
  }, [fetchMockSubscriptionForUser]);

  useEffect(() => {
    if (!auth) {
      console.warn("AuthProvider: Firebase Auth is not initialized. Falling back to mock authentication.");
      loadMockAuthData();
      // Listen to mock auth changes if Firebase isn't available
      const handleMockAuthChange = () => loadMockAuthData();
      window.addEventListener('mockAuthChange', handleMockAuthChange);
      return () => {
        window.removeEventListener('mockAuthChange', handleMockAuthChange);
      };
    } else {
      // Firebase Auth is initialized, set up the real listener
      console.log("AuthProvider: Firebase Auth is initialized. Setting up real auth state listener.");
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        console.log("AuthProvider: onAuthStateChanged triggered.");
        setLoading(true);
        setFirebaseUser(fbUser);
        if (fbUser) {
          console.log("AuthProvider: Firebase user detected:", fbUser.email);
          const appUser: User = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName,
            photoURL: fbUser.photoURL,
          };
          setUser(appUser);
          await fetchMockSubscriptionForUser(appUser);
          setIsAdmin(appUser.email === 'admin@example.com');
        } else {
          console.log("AuthProvider: No Firebase user detected.");
          setUser(null);
          setSubscription(null);
          setIsAdmin(false);
        }
        setLoading(false);
        console.log("AuthProvider: Firebase auth state processing finished.");
      });
      return () => unsubscribe();
    }
  }, [fetchMockSubscriptionForUser, loadMockAuthData]);


  // This function is primarily for the mock login flow from the /login page
  const signInUser = (loggedInUser: User, userSub: Subscription) => {
    console.log("AuthProvider: signInUser (mock) called for:", loggedInUser.email);
    if (!auth) { // Only use this if Firebase is not available or chosen mock flow
      setUser(loggedInUser);
      setSubscription(userSub);
      setIsAdmin(loggedInUser.email === 'admin@example.com');
      setLoading(false); // Ensure loading is false after mock sign-in
      // The mockLogin function in gramado-businesses.ts already handles localStorage
      // and dispatches 'mockAuthChange'
      console.log("AuthProvider: Mock user signed in. Admin status:", loggedInUser.email === 'admin@example.com');
    } else {
      console.warn("AuthProvider: signInUser (mock) called, but Firebase Auth is active. This function is intended for mock auth or if Firebase is disabled.");
      // If Firebase is active, actual sign-in should be handled by Firebase methods,
      // and onAuthStateChanged will update the state.
      // However, to allow testing the UI with mock roles even if Firebase config is present (but maybe not used for login):
      setUser(loggedInUser);
      setSubscription(userSub);
      setIsAdmin(loggedInUser.email === 'admin@example.com');
      setLoading(false);
    }
  };

  const signOutUser = async () => {
    console.log("AuthProvider: signOutUser called.");
    setLoading(true);
    if (auth && firebaseUser) {
      try {
        await firebaseSignOut(auth);
        console.log("AuthProvider: Successfully signed out from Firebase.");
        // onAuthStateChanged will handle setting user, subscription, isAdmin to null/false
      } catch (error) {
        console.error("AuthProvider: Error signing out from Firebase: ", error);
        toast({ title: "Erro no Logout", description: "Não foi possível fazer logout do Firebase. Tente novamente.", variant: 'destructive' });
        setLoading(false); // Reset loading on error
        return;
      }
    } else {
      // This handles mock logout or if Firebase user wasn't present
      await mockLogout(); // Clears localStorage for mock user
      console.log("AuthProvider: Successfully signed out from mock system or no Firebase user was present.");
      setUser(null);
      setFirebaseUser(null);
      setSubscription(null);
      setIsAdmin(false);
    }
    // setLoading(false) will be called by the onAuthStateChanged listener or by loadMockAuthData if in pure mock mode
    // For immediate UI update after explicit mock logout:
    if (!auth || !firebaseUser) {
        setLoading(false);
    }
    toast({ title: 'Logout Realizado', description: 'Você foi desconectado com sucesso.' });
    router.push('/login'); // Redirect after logout
    // Explicitly trigger mockAuthChange if needed for components listening to this
    if (!auth) window.dispatchEvent(new CustomEvent('mockAuthChange'));
  };

  const value = { user, firebaseUser, subscription, loading, signInUser, signOutUser, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProviderClient');
  }
  return context;
}
    