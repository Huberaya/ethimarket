import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { supabase, type Profile, type Producer } from './supabase';
import type { User } from '@supabase/supabase-js';

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  producer: Producer | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [producer, setProducer] = useState<Producer | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUserData = async (currentUser: User | null) => {
    if (!currentUser) {
      setProfile(null);
      setProducer(null);
      setLoading(false);
      return;
    }

    const [{ data: prof }, { data: prod }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', currentUser.id).maybeSingle(),
      supabase.from('producers').select('*').eq('user_id', currentUser.id).maybeSingle(),
    ]);

    setProfile(prof as Profile | null);
    setProducer(prod as Producer | null);
    setLoading(false);
  };

  const refresh = async () => {
    if (user) await loadUserData(user);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      loadUserData(currentUser);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      (async () => { await loadUserData(currentUser); })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setProducer(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, producer, loading, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
