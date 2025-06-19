"use client";

import {
  loginService,
  logoutService,
  refreshTokenService,
} from "@/services/auth.service";
import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { PropsWithChildren } from "react";
import type { callApiHandler } from "../api/callApi";
import { User } from "../api/type";

type AuthContextType = {
  user: User | undefined;
  setUser: (data: User | undefined) => void;
  login: (
    username: string,
    redirect?: boolean
  ) => ReturnType<typeof callApiHandler>;
  logout: (redirect: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  user,
  isRefreshTokenExpired,
  isTokenExpired,
}: PropsWithChildren & {
  user: User | undefined;
  isRefreshTokenExpired: boolean | undefined;
  isTokenExpired: boolean | undefined;
}) {
  const router = useRouter();
  const [userState, setUserState] = useState<User | undefined>(user);
  const login = useCallback(
    async (username: string, redirect = false) => {
      const res = await loginService(username);

      if (res.success && redirect) router.replace('/');

      return res;
    },
    [router]
  );

  const logout = useCallback(
    async (redirect: boolean) => {
      const res = await logoutService();
      if (res.success && redirect) router.push('/auth/login');
    },
    [router]
  );

  const refreshToken = useCallback(async () => {
    const res = await refreshTokenService();
    if (res.success) setUserState(res.data as User);
  }, []);

  useEffect(() => {
    setUserState(user);
  }, [user]);

  useEffect(() => {
    if (isRefreshTokenExpired) {
      logout(true);
      return;
    }
    if (isTokenExpired) {
      refreshToken();
    }
  }, [isRefreshTokenExpired, isTokenExpired, logout, refreshToken]);

  return (
    <AuthContext.Provider
      value={{ user: userState, logout, login, setUser: setUserState }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must used within AuthProvider");

  return context;
}
