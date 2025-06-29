"use client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

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
  const router = useRouter();

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    if (stored) {
      try {
        setUserState(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored auth:", e);
        localStorage.removeItem("auth");
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        return false;
      }

      const data = await res.json();

      const authUser: User = {
        id: data.user.id,
        username: data.user.username,
        token: data.token,
      };

      setUser(authUser);
      toast.success(`Welcome back, ${authUser.username}!`);
      router.push("/dashboard");
      return true;
    } catch (e) {
      toast.error('Login failed' + e);
      return false;
    }
  };

  // Save to localStorage when user changes
  const setUser = (user: User | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("auth", JSON.stringify(user));
    } else {
      localStorage.removeItem("auth");
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("Logged out");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
