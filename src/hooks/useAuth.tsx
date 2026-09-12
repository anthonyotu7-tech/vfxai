import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { supabase, isSupabaseEnabled } from '@/lib/supabase';
import type { User } from '@/types';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (p: { full_name: string; username: string; email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const DEMO_USER: User = {
  id: 'u1',
  email: 'demo@vfxai.app',
  full_name: 'Demo User',
  username: 'demo',
  role: 'user',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseEnabled) {
      // Demo session from localStorage
      const raw = localStorage.getItem('vfxai.demo.user');
      if (raw) setUser(JSON.parse(raw));
      setLoading(false);
      return;
    }
    supabase!.auth.getSession().then(({ data }) => {
      const s = data.session?.user;
      if (s) {
        setUser({
          id: s.id, email: s.email ?? '',
          full_name: (s.user_metadata?.full_name as string) ?? '',
          username: (s.user_metadata?.username as string) ?? '',
          role: (s.user_metadata?.role as 'user' | 'admin') ?? 'user',
          created_at: s.created_at,
        });
      }
      setLoading(false);
    });
    const { data: sub } = supabase!.auth.onAuthStateChange((_e, session) => {
      const s = session?.user;
      if (s) {
        setUser({
          id: s.id, email: s.email ?? '',
          full_name: (s.user_metadata?.full_name as string) ?? '',
          username: (s.user_metadata?.username as string) ?? '',
          role: (s.user_metadata?.role as 'user' | 'admin') ?? 'user',
          created_at: s.created_at,
        });
      } else setUser(null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseEnabled) {
      const u = { ...DEMO_USER, email };
      setUser(u);
      localStorage.setItem('vfxai.demo.user', JSON.stringify(u));
      return;
    }
    const { error } = await supabase!.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const signUp = useCallback(async (p: { full_name: string; username: string; email: string; password: string }) => {
    if (!isSupabaseEnabled) {
      const u: User = {
        id: 'u_' + Math.random().toString(36).slice(2),
        email: p.email, full_name: p.full_name, username: p.username,
        role: 'user', created_at: new Date().toISOString(),
      };
      setUser(u);
      localStorage.setItem('vfxai.demo.user', JSON.stringify(u));
      return;
    }
    const { error } = await supabase!.auth.signUp({
      email: p.email, password: p.password,
      options: { data: { full_name: p.full_name, username: p.username } },
    });
    if (error) throw error;
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseEnabled) {
      setUser(null);
      localStorage.removeItem('vfxai.demo.user');
      return;
    }
    await supabase!.auth.signOut();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!isSupabaseEnabled) throw new Error('Google sign-in is not configured in demo mode.');
    await supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/dashboard' } });
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    if (!isSupabaseEnabled) return;
    await supabase!.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin + '/login' });
  }, []);

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword }), [user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useAuth must be used within AuthProvider');
  return c;
}