
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


  const fetchMockDataForUser = useCallback(async (currentAppUser: User) => {
    try {
      const subDetails = await getMockUserSubscription(currentAppUser.id);
      setSubscription(subDetails);
    } catch (error) {
      console.warn("Error fetching mock subscription for user:", currentAppUser.email, error);
      setSubscription(null);
    }
  }, []);

  useEffect(() => {
    if (!auth) {
      console.warn("Firebase Auth is not initialized. Falling back to mock authentication.");
      const loadMockAuthData = async () => {
        setLoading(true);
        try {
          const mockAppUser = await getMockCurrentUser();
          setUser(mockAppUser);
          if (mockAppUser) {
            await fetchMockDataForUser(mockAppUser);
            setIsAdmin(mockAppUser.email === 'admin@example.com');
          } else {
            setSubscription(null);
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error fetching mock auth data:", error);
          setUser(null);
          setSubscription(null);
          setIsAdmin(false);
        } finally {
          setLoading(false);
        }
      };
      loadMockAuthData();
      // Listen to mock auth changes if Firebase isn't available
      const handleMockAuthChange = () => loadMockAuthData();
      window.addEventListener('mockAuthChange', handleMockAuthChange);
      return () => {
        window.removeEventListener('mockAuthChange', handleMockAuthChange);
      };
    } else {
      // Firebase Auth is initialized, set up the real listener
      console.log("Firebase Auth is initialized. Setting up real auth state listener.");
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setLoading(true);
        setFirebaseUser(fbUser);
        if (fbUser) {
          console.log("Firebase user detected:", fbUser.email);
          // Adapt FirebaseUser to your app's User type
          const appUser: User = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName,
            photoURL: fbUser.photoURL,
          };
          setUser(appUser);
          await fetchMockDataForUser(appUser); // Still using mock subscription for now
          setIsAdmin(appUser.email === 'admin@example.com');
        } else {
          console.log("No Firebase user detected.");
          setUser(null);
          setSubscription(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return () => unsubscribe(); // Cleanup listener on component unmount
    }
  }, [fetchMockDataForUser]);


  // This function is primarily for the mock login flow
  const signInUser = (loggedInUser: User, userSub: Subscription) => {
    if (!auth) { // Only use this if Firebase is not available
      setUser(loggedInUser);
      setSubscription(userSub);
      setIsAdmin(loggedInUser.email === 'admin@example.com');
      setLoading(false);
      localStorage.setItem('mockUser', JSON.stringify(loggedInUser));
      localStorage.setItem('mockSubscription', JSON.stringify(userSub));
      window.dispatchEvent(new CustomEvent('mockAuthChange'));
    } else {
      console.warn("signInUser called, but Firebase Auth is active. This function is for mock auth.");
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    if (auth && firebaseUser) {
      // Real Firebase sign out
      try {
        await firebaseSignOut(auth);
        console.log("Successfully signed out from Firebase.");
        // Auth state listener will clear user, firebaseUser, subscription, isAdmin
      } catch (error) {
        console.error("Error signing out from Firebase: ", error);
        toast({ title: "Erro no Logout", description: "Não foi possível fazer logout do Firebase. Tente novamente.", variant: 'destructive' });
        setLoading(false); // Reset loading on error
        return; // Exit if Firebase sign-out fails
      }
    } else {
      // Mock sign out
      await mockLogout();
      console.log("Successfully signed out from mock system.");
      setUser(null);
      setFirebaseUser(null);
      setSubscription(null);
      setIsAdmin(false);
    }
    setLoading(false); // Set loading to false after state updates are certain
    // The onAuthStateChanged listener (or mockAuthChange) should handle global state updates
    // and redirects are typically handled by pages checking auth state.
    toast({ title: 'Logout Realizado', description: 'Você foi desconectado com sucesso.' });
    router.push('/login');
    window.dispatchEvent(new CustomEvent('mockAuthChange')); // Ensure mock system also reacts if it was in use
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
    