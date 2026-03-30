'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Session, User } from '@supabase/supabase-js';
import { getSupabase } from '@/lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  signOut: async () => {},
});

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseAvailable, setSupabaseAvailable] = useState(true);

  useEffect(() => {
    // Check initial session
    const checkSession = async () => {
      try {
        const supabase = getSupabase();
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Error checking session:', error);
        setSupabaseAvailable(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth state changes
    try {
      const supabase = getSupabase();
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription?.unsubscribe();
      };
    } catch (error) {
      console.error('Error subscribing to auth changes:', error);
      setSupabaseAvailable(false);
    }
  }, []);

  const signOut = async () => {
    try {
      if (supabaseAvailable) {
        await getSupabase().auth.signOut();
      }
      setUser(null);
      setSession(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
