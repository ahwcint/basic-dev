'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { getSocket } from '@/lib/socket';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import type { Socket } from 'socket.io-client';

export function useWebSocket() {
  const socketRef = useRef<null | Socket>(null);
  const { user } = useAuth();

  const listener = useMemo(
    () => ({
      on: <T>(listener: string, fn: (res: T) => void) => {
        if (!socketRef.current) return;
        socketRef.current.on(listener, fn);
      },
      off: <T>(listener: string, fn: (res: T) => void) => {
        if (!socketRef.current) return;
        socketRef.current.off(listener, fn);
      },
    }),
    [],
  );

  const emit = useCallback((emitTo: string, data: unknown) => {
    if (!socketRef.current) return;
    socketRef.current.emit(emitTo, data);
  }, []);

  useEffect(() => {
    if (!user) return;
    if (!socketRef.current) {
      socketRef.current = getSocket({ userId: user.id });
    }

    const socket = socketRef.current;

    const handleClients = (msg: unknown) => {
      console.log('[SERVER]', msg);
    };
    const handleError = (msg: unknown) => {
      console.log('[ERROR]', msg);
    };

    socket.on('clients', handleClients);
    socket.on('error', handleError);

    return () => {
      socket.off('clients', handleClients);
      socket.off('error', handleError);
    };
  }, [user]);

  return {
    emit,
    listener,
  };
}
