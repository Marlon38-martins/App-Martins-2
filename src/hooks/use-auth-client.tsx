// src/hooks/use-auth-client.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged as onFirebaseAuthStateChanged } from '@/lib/firebase/auth'; // Your wrapper
import type { User } from '@/types/user'; // Your application's User type

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderClient({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // The onFirebaseAuthStateChanged function should handle mapping FirebaseUser to your User type
    const unsubscribe = onFirebaseAuthStateChanged((appUser) => {
      setUser(appUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const value = useMemo(() => ({ user, loading, error }), [user, loading, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProviderClient');
  }
  return context;
}
