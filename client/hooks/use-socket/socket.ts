'use client';

import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { SocketRooms } from './type';
import { toast } from 'sonner';
import { HttpStatusCode } from 'axios';
import { refreshTokenService } from '@/services/auth.service';
import { useAuth } from '@/lib/context/AuthContext';

export type SocketResponse<T> = { data: T; success: boolean };

const socket = io(process.env.NEXT_PUBLIC_BACKEND_API, {
  path: '/socket.io',
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  autoConnect: false,
});

let retry_count = 0;
const MAX_RETRY = 3;

const onError = async (res: { code: HttpStatusCode; message: string }) => {
  if (res.code === HttpStatusCode.Unauthorized) {
    if (retry_count < MAX_RETRY) {
      await refreshTokenService();
      socket.disconnect();
      socket.connect();
      retry_count++;
      return;
    }
  }
  toast.error(res.message || 'Socket error occurred');
};

const onConnect = () => {
  console.log('connected');
};

socket.on('connect', onConnect);
socket.on('error', onError);
// socket.on('disconnect', (reason) => {
//   console.warn('❌ Disconnected:', reason);
// });
// socket.on('reconnect_attempt', (attemptNumber) => {
//   console.warn(`⏳ Trying to reconnect #${attemptNumber}`);
// });
// socket.on('reconnect', (attemptNumber) => {
//   console.warn(`🔥 Reconnected after ${attemptNumber} attempts`);
// });

export const useJoinRoom = (roomId: SocketRooms) => {
  const isJoined = useRef(false);
  useEffect(() => {
    const join = () => {
      if (isJoined.current) return;
      socket.emit('join-room', roomId);
      isJoined.current = true;
    };

    if (socket.connected) {
      join();
    } else {
      socket.on('connect', join);
    }

    return () => {
      if (!isJoined.current) socket.emit('leave-room', roomId);
      socket.off('connect', join);
    };
  }, [roomId]);

  return {
    isJoined: isJoined.current,
  };
};

export const useSocket = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (socket.connected) return;

    socket.auth = {
      token,
    };
    socket.connect();
  }, [token]);

  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);
  return { socket, isConnected: socket.connected };
};
