// src/hooks/use-auth-client.tsx
'use client';

import type { User, Subscription } from '@/types/user';
import { getCurrentUser, getMockUserSubscription, mockLogin, mockLogout } from '@/services/gramado-businesses';
import type { LucideIcon } from 'lucide-react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface AuthContextType {
  user: User | null;
  subscription: Subscription | null;
  loading: boolean;
  signInUser: (user: User, sub: Subscription) => void; // Simplified for mock
  signOutUser: () => void; // Simplified for mock
  isAdmin: boolean; // Placeholder
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderClientProps {
  children: React.ReactNode;
}

export function AuthProviderClient({ children }: AuthProviderClientProps) {
  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Placeholder

  const fetchAuthData = useCallback(async () => {
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        const subDetails = await getMockUserSubscription(currentUser.id);
        setSubscription(subDetails);
        // Placeholder for admin check
        setIsAdmin(currentUser.email === 'admin@example.com'); 
      } else {
        setSubscription(null);
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("Error fetching auth data:", error);
      setUser(null);
      setSubscription(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAuthData();
    // Listen for custom event to refetch auth data if login/logout happens elsewhere
    const handleAuthChange = () => fetchAuthData();
    window.addEventListener('mockAuthChange', handleAuthChange);
    return () => {
      window.removeEventListener('mockAuthChange', handleAuthChange);
    };
  }, [fetchAuthData]);

  const signInUser = (loggedInUser: User, userSub: Subscription) => {
    // This function is now primarily for updating context state after mockLogin is called elsewhere
    setUser(loggedInUser);
    setSubscription(userSub);
    setIsAdmin(loggedInUser.email === 'admin@example.com'); // Placeholder
    setLoading(false);
    window.dispatchEvent(new CustomEvent('mockAuthChange'));
  };

  const signOutUser = async () => {
    setLoading(true);
    await mockLogout(); // Use the service's mockLogout
    setUser(null);
    setSubscription(null);
    setIsAdmin(false);
    setLoading(false);
    window.dispatchEvent(new CustomEvent('mockAuthChange'));
  };
  
  const value = { user, subscription, loading, signInUser, signOutUser, isAdmin };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProviderClient');
  }
  return context;
}
