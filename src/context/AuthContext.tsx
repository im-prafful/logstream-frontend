import { createContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  role: string;
  permissions: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('JWT');
    const storedUser = localStorage.getItem('USER_DATA');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem('JWT');
        localStorage.removeItem('USER_DATA');
      }
    }

    setIsLoading(false);
  }, []);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem('JWT', token);
    localStorage.setItem('USER_DATA', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('JWT');
    localStorage.removeItem('USER_DATA');
  };

  const hasPermission = (permission: string) =>
    !!user?.permissions?.includes(permission);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        hasPermission,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}