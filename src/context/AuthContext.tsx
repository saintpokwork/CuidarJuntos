import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthError, Session, User } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

interface SignUpResult {
  error: AuthError | Error | null;
  requiresEmailConfirmation?: boolean;
  alreadyRegistered?: boolean;
  email?: string;
}

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | Error | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | Error | null }>;
  resendConfirmation: (email: string) => Promise<{ error: AuthError | Error | null }>;
  updatePassword: (password: string) => Promise<{ error: AuthError | Error | null }>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('O serviço de autenticação não está configurado.') };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/entrar?confirmed=1` : undefined;
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo,
        data: {
          full_name: name,
        },
      },
    });

    const identities = data.user?.identities || [];
    const alreadyRegistered = Boolean(data.user && identities.length === 0);

    return {
      error: error ?? null,
      requiresEmailConfirmation: Boolean(data.user && !data.session),
      alreadyRegistered,
      email: normalizedEmail,
    };
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('O serviço de autenticação não está configurado.') };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setSession(data.session ?? null);
    setUser(data.session?.user ?? null);
    return { error: error ?? null };
  };

  const signOut = async () => {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('O serviço de autenticação não está configurado.') };
    }

    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/atualizar-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
    return { error: error ?? null };
  };

  const resendConfirmation = async (email: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('O serviço de autenticação não está configurado.') };
    }

    const normalizedEmail = email.trim().toLowerCase();
    const emailRedirectTo = typeof window !== 'undefined' ? `${window.location.origin}/entrar?confirmed=1` : undefined;
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: normalizedEmail,
      options: {
        emailRedirectTo,
      },
    });
    return { error: error ?? null };
  };

  const updatePassword = async (password: string) => {
    if (!isSupabaseConfigured) {
      return { error: new Error('O serviço de autenticação não está configurado.') };
    }

    const { error } = await supabase.auth.updateUser({ password });
    return { error: error ?? null };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
    resendConfirmation,
    updatePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
