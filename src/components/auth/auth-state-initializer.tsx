// src/components/auth/auth-state-initializer.tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth-client'; // Assuming useAuth provides a way to set user/loading

export function AuthStateInitializer() {
  const { user, loading } = useAuth(); // Access state from context

  // The primary responsibility of fetching user state is now within AuthProviderClient.
  // This component can be simplified or used for other one-time auth-related initializations if needed.
  
  useEffect(() => {
    // console.log('AuthStateInitializer: User state updated', { user, loading });
    // If there's any specific logic that needs to run once based on initial auth state, it can go here.
    // For now, it mainly ensures the AuthProviderClient has run its initial data fetch.
  }, [user, loading]);

  return null; // This component does not render anything itself
}
