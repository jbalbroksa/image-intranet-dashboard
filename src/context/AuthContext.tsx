
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { User, UserRole, UserType } from '@/types';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

export interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  session: null,
  signIn: async () => {},
  signOut: async () => {},
  loading: true,
  error: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        setSession(session);
        setSupabaseUser(session?.user || null);
        
        if (session?.user) {
          // Get user data from the users table
          fetchUserData(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session);
      setSession(session);
      setSupabaseUser(session?.user || null);
      
      if (session?.user) {
        // Get user data from the users table
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      console.log('Fetching user data for ID:', userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user data:', error);
        throw error;
      }

      if (data) {
        console.log('User data fetched:', data);
        // Map data to User interface
        setUser({
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role as UserRole,
          type: data.type as UserType,
          avatar: data.avatar,
          branchId: data.branch_id,
          position: data.position,
          extension: data.extension,
          socialContact: data.social_contact,
          createdAt: data.created_at
        });
      } else {
        console.warn('No user data found for ID:', userId);
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error.message);
      setError(error.message);
      toast({
        title: "Error de autenticación",
        description: "No se pudo obtener los datos del usuario",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Attempting sign in for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }
      
      console.log('Sign in successful:', data);
      toast({
        title: "Sesión iniciada",
        description: "Ha iniciado sesión correctamente"
      });
    } catch (error: any) {
      console.error('Error signing in:', error.message);
      setError(error.message);
      toast({
        title: "Error al iniciar sesión",
        description: error.message || "Credenciales incorrectas",
        variant: "destructive"
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Signing out');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      toast({
        title: "Sesión cerrada",
        description: "Ha cerrado sesión correctamente"
      });
    } catch (error: any) {
      console.error('Error signing out:', error.message);
      setError(error.message);
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    supabaseUser,
    session,
    signIn,
    signOut,
    loading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
