"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { User } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { Loader } from '@/components/ui/loader';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error?: string;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    // Set a timeout to prevent infinite loading
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('Firebase auth initialization timeout - proceeding without auth');
        setLoading(false);
        setError('Auth initialization timeout');
      }
    }, 5000); // 5 second timeout

    let unsubscribe: (() => void) | undefined;

    try {
      unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          setUser(user);
          setLoading(false);
          clearTimeout(timeout);
        },
        (error) => {
          console.error('Firebase auth error:', error);
          setError(error.message);
          setLoading(false);
          clearTimeout(timeout);
        }
      );
    } catch (err) {
      console.error('Failed to initialize Firebase auth:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
      clearTimeout(timeout);
    }

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader className="h-12 w-12" />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loading, error }}>
      {children}
    </AuthContext.Provider>
  );
};
