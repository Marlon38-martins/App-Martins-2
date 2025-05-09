// src/hooks/use-auth-client.tsx
'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { onAuthStateChanged as onFirebaseAuthStateChanged } from '@/lib/firebase/auth'; // Your wrapper
import type { User } from '@/types/user'; // Your application's User type
import type { AuthError } from 'firebase/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | Error | null; // Allow for general errors too
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProviderClient({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | Error | null>(null);

  useEffect(() => {
    // Client-side check for Firebase API Key
    if (typeof window !== 'undefined' && !process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
      const apiKeyWarning = 'Firebase API Key Missing! The NEXT_PUBLIC_FIREBASE_API_KEY environment variable is not set. Firebase authentication will likely fail. Please ensure it is correctly configured in your .env.local file and that the Next.js development server has been restarted.';
      console.warn(
        '%cFirebase API Key Missing!',
        'color: red; font-weight: bold; font-size: 1.2em;',
        apiKeyWarning
      );
      // Set an error state to inform the developer more directly if needed
      // setError(new Error(apiKeyWarning));
      // Note: Firebase itself will also throw an error if the API key is invalid/missing during initialization.
    }

    const unsubscribe = onFirebaseAuthStateChanged((appUser, authError) => {
      if (authError) {
        console.error("Firebase AuthStateChanged Error:", authError);
        setError(authError);
         if (authError.code === 'auth/invalid-api-key') {
             console.error(
                '%cFirebase Authentication Failed: Invalid API Key',
                'color: red; font-weight: bold; font-size: 1.2em;',
                'Please check your NEXT_PUBLIC_FIREBASE_API_KEY in your environment variables.'
            );
        }
      } else {
        // If auth state changes successfully (e.g., user logs in/out without error), clear previous errors
        // However, be cautious if an API key error was set initially and never cleared.
        // For now, we'll clear general auth errors if a user state is successfully received.
        if (error?.name === 'FirebaseError') { // Clear only Firebase specific errors if user state is now valid
             // setError(null); // Or be more specific based on error codes
        }
      }
      setUser(appUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [error]); // Added error to dependency array to avoid stale closure issues if setError was called from outside

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
