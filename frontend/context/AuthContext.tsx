'use client';
import { API_BASE_URL } from '@/lib/config';
import { toast } from 'sonner';
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

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

  // 🔹 Load user from localStorage on initial mount
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

  // 🔹 Login logic
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
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

  // 🔹 Set user and persist in localStorage
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('auth', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth');
    }
  };

  // 🔹 Logout logic
  const logout = () => {
    setUser(null); // clears localStorage and resets user
    toast.info('Logged out');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 🔹 Custom hook to consume the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
