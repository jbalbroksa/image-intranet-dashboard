
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo purposes
const MOCK_USER: User = {
  id: 'user-1',
  name: 'José García',
  email: 'jose@conectaseguros.com',
  role: 'admin',
  type: 'Administrador',
  avatar: '/lovable-uploads/6d6736eb-dda1-4754-b5ef-0c42c4078fab.png',
  branchId: 'branch-1',
  position: 'Director de Tecnología',
  extension: '26',
  socialContact: '@JOSECONECTASEGUROS',
  createdAt: '2023-01-15'
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch the user from an API
        setTimeout(() => {
          setUser(MOCK_USER);
          // Mock session
          setSession({
            access_token: 'mock-token',
            refresh_token: 'mock-refresh-token',
            expires_in: 3600,
            expires_at: Math.floor(Date.now() / 1000) + 3600,
            user: {
              id: MOCK_USER.id,
              email: MOCK_USER.email,
              app_metadata: {},
              user_metadata: {},
              aud: 'authenticated',
              created_at: MOCK_USER.createdAt
            }
          } as unknown as Session);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
        setSession(null);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock successful login
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser(MOCK_USER);
      // Set mock session
      setSession({
        access_token: 'mock-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        user: {
          id: MOCK_USER.id,
          email: MOCK_USER.email,
          app_metadata: {},
          user_metadata: {},
          aud: 'authenticated',
          created_at: MOCK_USER.createdAt
        }
      } as unknown as Session);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
