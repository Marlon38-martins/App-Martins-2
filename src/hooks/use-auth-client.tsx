
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
  firebaseUser: FirebaseUser | null;
  subscription: Subscription | null;
  loading: boolean;
  signInUser: (user: User, sub: Subscription) => void; // For mock sign-in
  signOutUser: () => Promise<void>;
  isAdmin: boolean;
  isPartner: boolean; // Add this to easily identify a partner
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderClientProps {
  children: React.ReactNode;
}

export function AuthProviderClient({ children }: AuthProviderClientProps) {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPartner, setIsPartner] = useState(false); // State for partner role
  const { toast } = useToast();
  const router = useRouter();

  const processUser = useCallback(async (appUser: User | null) => {
    setUser(appUser);
    if (appUser) {
      const subDetails = await getMockUserSubscription(appUser.id);
      setSubscription(subDetails);
      const adminStatus = appUser.email === 'admin@example.com';
      const partnerStatus = appUser.email === 'partner@example.com';
      setIsAdmin(adminStatus);
      setIsPartner(partnerStatus && !adminStatus); // A partner is not also an admin
      console.log(`AuthProvider: User processed: ${appUser.email}, Admin: ${adminStatus}, Partner: ${partnerStatus}`);
    } else {
      setSubscription(null);
      setIsAdmin(false);
      setIsPartner(false);
      console.log("AuthProvider: No user processed.");
    }
  }, []);

  const loadMockAuthData = useCallback(async () => {
    console.log("AuthProvider: Attempting to load mock auth data...");
    setLoading(true);
    try {
      const mockAppUser = await getMockCurrentUser();
      await processUser(mockAppUser);
    } catch (error) {
      console.error("AuthProvider: Error fetching mock auth data:", error);
      await processUser(null);
    } finally {
      setLoading(false);
      console.log("AuthProvider: Mock auth data loading finished.");
    }
  }, [processUser]);

  useEffect(() => {
    if (!auth) { // Firebase Auth not initialized, use mock system
      console.warn("AuthProvider: Firebase Auth is not initialized. Using mock authentication.");
      loadMockAuthData();
      const handleMockAuthChange = () => loadMockAuthData();
      window.addEventListener('mockAuthChange', handleMockAuthChange);
      return () => {
        window.removeEventListener('mockAuthChange', handleMockAuthChange);
      };
    } else { // Firebase Auth is initialized
      console.log("AuthProvider: Firebase Auth initialized. Setting up real auth state listener.");
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        console.log("AuthProvider: onAuthStateChanged triggered.");
        setLoading(true);
        setFirebaseUser(fbUser);
        if (fbUser) {
          const appUser: User = {
            id: fbUser.uid,
            email: fbUser.email,
            name: fbUser.displayName,
            photoURL: fbUser.photoURL,
          };
          await processUser(appUser);
        } else {
          await processUser(null);
        }
        setLoading(false);
        console.log("AuthProvider: Firebase auth state processing finished.");
      });
      return () => unsubscribe();
    }
  }, [processUser, loadMockAuthData]);


  const signInUser = (loggedInUser: User, userSub: Subscription) => {
    console.log("AuthProvider: signInUser (mock) called for:", loggedInUser.email);
    setLoading(true); // Set loading true during this process
    setUser(loggedInUser);
    setSubscription(userSub);
    const adminStatus = loggedInUser.email === 'admin@example.com';
    const partnerStatus = loggedInUser.email === 'partner@example.com';
    setIsAdmin(adminStatus);
    setIsPartner(partnerStatus && !adminStatus);
    setLoading(false);
    console.log(`AuthProvider: Mock user signed in. Admin: ${adminStatus}, Partner: ${partnerStatus}`);
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
        setLoading(false);
        return;
      }
    } else {
      await mockLogout(); // Clears localStorage for mock user
      console.log("AuthProvider: Successfully signed out from mock system or no Firebase user was present.");
      setUser(null);
      setFirebaseUser(null);
      setSubscription(null);
      setIsAdmin(false);
      setIsPartner(false);
      setLoading(false); // Explicitly set loading false for mock logout
      if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('mockAuthChange'));
    }
    toast({ title: 'Logout Realizado', description: 'Você foi desconectado com sucesso.' });
    router.push('/login');
  };

  const value = { user, firebaseUser, subscription, loading, signInUser, signOutUser, isAdmin, isPartner };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProviderClient');
  }
  return context;
}
