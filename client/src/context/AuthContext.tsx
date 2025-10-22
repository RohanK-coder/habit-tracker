import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMe() {
      try {
        if (!token) return;
        const { data } = await api.get<User>("/api/me");
        setUser(data);
      } catch {
        // invalid token
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    fetchMe();
  }, [token]);

  async function login(email: string, password: string) {
    const { data } = await api.post<{ user: User; token: string }>("/api/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  async function register(email: string, password: string) {
    const { data } = await api.post<{ user: User; token: string }>("/api/auth/register", { email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
