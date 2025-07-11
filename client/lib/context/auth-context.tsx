'use client';

import {
  loginService,
  logoutService,
  refreshTokenService,
  registerService,
} from '@/services/auth.service';
import { usePathname, useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import type { Dispatch, PropsWithChildren, SetStateAction } from 'react';
import { User } from '@/services/types/user.type';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ComponentLoading } from '@/components/common/component-loading';

type AuthFn = (props: {
  payload: { username: string; password: string };
  onSettled?: () => void;
  onSuccess?: () => void;
}) => void;

type AuthContextType = {
  token: string;
  user: User | null;
  login: AuthFn;
  register: AuthFn;
  logout: (redirect: boolean) => void;
  setLoading: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  isTokenExpired,
  isRefreshTokenExpired,
  accessToken,
  accessUser,
}: PropsWithChildren & {
  accessUser: User | null;
  isRefreshTokenExpired: boolean | undefined;
  isTokenExpired: boolean | undefined;
  accessToken: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = pathname.startsWith('/auth');
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>(accessToken);
  const [user, setUser] = useState<User | null>(accessUser);

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
        onSuccess: () => {
          setLoading(true);
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
      setUser(null);
      setToken('');
    },
    [router],
  );

  const register: AuthContextType['register'] = useCallback(
    ({ payload, onSettled, onSuccess }) => {
      registerServiceApi(payload, {
        onSuccess: () => {
          setLoading(true);
          onSuccess?.();
        },
        onSettled,
      });
    },
    [registerServiceApi],
  );

  useEffect(() => {
    if (isAuthPath) return;
    if (isRefreshTokenExpired) {
      logout(true);
    }
    if (isTokenExpired && !isRefreshTokenExpired) {
      refreshTokenService()
        .then((res) => {
          setToken(res.data.token);
          setUser(res.data.user);
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
  }, [isRefreshTokenExpired, isTokenExpired, logout, isAuthPath]);

  useEffect(() => {
    if (isAuthPath) return setLoading(false);

    setToken(accessToken);
    setUser(accessUser);
  }, [accessToken, isAuthPath, accessUser]);

  useEffect(() => {
    if (!isAuthPath) setLoading(!(user && token));
  }, [user, token, isAuthPath]);
  return (
    <AuthContext.Provider
      value={{
        logout,
        login,
        register,
        token,
        setLoading,
        loading,
        user,
      }}
    >
      {loading ? <ComponentLoading className="p-2" /> : children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must used within AuthProvider');

  return context as AuthContextType;
}
