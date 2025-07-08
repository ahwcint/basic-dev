'use client';

import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { User } from '@/services/types/user.type';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

type AuthFn = (props: {
  payload: { username: string; password: string };
  onSettled?: () => void;
  onSuccess?: () => void;
}) => void;

type AuthContextType = {
  token: string;
  user: User | null;
  setUser: (data: User | null) => void;
  login: AuthFn;
  register: AuthFn;
  logout: (redirect: boolean) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  user,
  isTokenExpired,
  isRefreshTokenExpired,
  accessToken,
}: PropsWithChildren & {
  user: AuthContextType['user'];
  isRefreshTokenExpired: boolean | undefined;
  isTokenExpired: boolean | undefined;
  accessToken: string;
}) {
  const router = useRouter();
  const [userState, setUserState] = useState<AuthContextType['user']>(user);
  const [token, setToken] = useState<string>(accessToken);
  const [loading, setLoading] = useState<boolean>(true);
  const { mutate: registerServiceApi } = useMutation({
    mutationKey: ['register-user'],
    mutationFn: registerService,
    onSuccess: (res) => toast.success(res.message),
  });

  const { mutate: loginServiceApi } = useMutation({
    mutationKey: ['login-user'],
    mutationFn: loginService,
  });

  const login: AuthContextType['login'] = useCallback(
    ({ payload, onSettled, onSuccess }) => {
      loginServiceApi(payload, {
        onSuccess: (res) => {
          toast.success(res.message);
          setUserState(res.data);
          onSuccess?.();
        },
        onSettled,
      });
    },
    [loginServiceApi],
  );

  const logout = useCallback(
    (redirect: boolean) => {
      logoutService().then((res) => {
        if (res.success && redirect) router.push('/auth/login');
      });
    },
    [router],
  );

  const register: AuthContextType['register'] = useCallback(
    ({ payload, onSettled, onSuccess }) => {
      registerServiceApi(payload, {
        onSuccess: (res) => {
          setUserState(res.data);
          onSuccess?.();
        },
        onSettled,
      });
    },
    [registerServiceApi],
  );

  useEffect(() => {
    setUserState(user);
    setToken(accessToken);
  }, [user, accessToken]);

  useEffect(() => {
    if (isTokenExpired) {
      refreshTokenService()
        .then((res) => {
          setToken(res.data.token);
          setUserState(res.data.user);
        })
        .catch(() => {
          toast.error('Session expired, logging out...');
          logout(true);
        })
        .finally(() => {
          setLoading(false);
        });
      return;
    }

    setLoading(false);
  }, [isTokenExpired, logout]);

  useEffect(() => {
    if (isRefreshTokenExpired) {
      logout(true);
    }
  }, [isRefreshTokenExpired, logout]);

  return (
    <AuthContext.Provider
      value={{
        user: userState,
        logout,
        login,
        setUser: setUserState,
        register,
        token,
      }}
    >
      {loading ? <>loading</> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must used within AuthProvider');

  return context as AuthContextType & { user: User };
}
