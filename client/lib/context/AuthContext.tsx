"use client";

import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
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
import { User } from "@/services/types/user.type";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

type AuthFn = (props: {
  payload: { username: string; password: string };
  onSettled?: () => void;
}) => void;

type AuthContextType = {
  user: User | undefined;
  setUser: (data: User | undefined) => void;
  login: AuthFn;
  register: AuthFn;
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
  const { mutate: registerServiceApi } = useMutation({
    mutationKey: ["register-user"],
    mutationFn: registerService,
    onSuccess: (res) => toast.success(res.message),
  });

  const { mutate: loginServiceApi } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: loginService,
  });

  const login: AuthContextType["login"] = useCallback(
    ({ payload, onSettled }) => {
      loginServiceApi(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setUserState(res.data);
        },
        onSettled,
      });
    },
    [loginServiceApi]
  );

  const logout = useCallback(
    (redirect: boolean) => {
      logoutService().then((res) => {
        setUserState(undefined);
        if (res.success && redirect) router.push("/auth/login");
      });
    },
    [router]
  );

  const register: AuthContextType["register"] = useCallback(
    ({ payload, onSettled }) => {
      registerServiceApi(payload, {
        onSuccess: (res) => {
          setUserState(res.data);
        },
        onSettled,
      });
    },
    [registerServiceApi]
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
      value={{
        user: userState,
        logout,
        login,
        setUser: setUserState,
        register,
      }}
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
