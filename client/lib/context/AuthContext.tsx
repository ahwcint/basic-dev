"use client";

import { loginService, logoutService } from "@/services/auth.service";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { callApiHandler } from "../api/callApi";

type AuthContextType = {
  user: string | null;
  login: (
    username: string,
    redirect?: boolean
  ) => ReturnType<typeof callApiHandler>;
  logout: (redirect?: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  token = "",
}: PropsWithChildren & { token: string | undefined }) {
  const [user, setUser] = useState<AuthContextType["user"]>(null);
  const router = useRouter();

  const login = useCallback(
    async (username: string, redirect = false) => {
      const res = await loginService(username);

      if (res.success && redirect) router.refresh();

      return res;
    },
    [router]
  );

  const logout = useCallback(
    async (redirect = false) => {
      const res = await logoutService();

      if (res.success && redirect) router.refresh();
    },
    [router]
  );

  useEffect(() => {
    if (!token) {
      setUser(null);
      logout(true);
      return;
    }

    try {
      const user = jwtDecode(token);

      const now = Math.floor(Date.now() / 1000);
      const isExpired = (user.exp as number) < now;

      if (isExpired) {
        console.warn("Token expired");
        setUser(null);
      } else {
        setUser(user.sub as string);
      }
    } catch (err) {
      console.warn("Invalid token", err);
      setUser(null);
      logout(true);
    }
  }, [logout, token]);

  return (
    <AuthContext.Provider value={{ user, logout, login }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must used within AuthProvider");

  return context;
}
