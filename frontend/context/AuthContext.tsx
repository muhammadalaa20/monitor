'use client';

import { toast } from 'sonner';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type User = {
  id: number;
  username: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);

  // Load session on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse auth session:', e);
        localStorage.removeItem('auth');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) return false;

      const data = await res.json();

      const authUser: User = {
        id: data.user.id,
        username: data.user.username,
        token: data.token,
      };

      setUser(authUser);
      toast.success(`Welcome back, ${authUser.username}!`);
      return true;
    } catch (err) {
      toast.error('Login failed' + (err instanceof Error ? `: ${err.message}` : ''));
      return false;
    }
  };

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
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
