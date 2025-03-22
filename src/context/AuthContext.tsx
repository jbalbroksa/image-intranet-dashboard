
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user data
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // In a real app, we would fetch the user from an API
        setTimeout(() => {
          setUser(MOCK_USER);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Authentication error:', error);
        setUser(null);
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
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
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
