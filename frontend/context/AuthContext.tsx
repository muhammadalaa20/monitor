'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored auth:', e);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  // Save to localStorage when user changes
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
