'use client';

import { useEffect } from 'react';
import { io } from 'socket.io-client';
import { SocketRooms } from './type';
import { toast } from 'sonner';

const socket = io(process.env.NEXT_PUBLIC_BACKEND_API, {
  path: '/socket.io',
  transports: ['websocket'],
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

socket.on('error', (res) => {
  toast.error(res.message);
});

// socket.on('connect', () => {
//   console.log('✅ Connected');
// });

socket.on('disconnect', (reason) => {
  toast.warning('❌ Socket Disconnected');
  console.warn('❌ Disconnected:', reason);
});

socket.on('reconnect_attempt', (attemptNumber) => {
  toast.warning(`⏳ Trying to reconnect #${attemptNumber}`);
  console.warn(`⏳ Trying to reconnect #${attemptNumber}`);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`🔥 Reconnected after ${attemptNumber} attempts`);
});

export const useJoinRoom = (roomId: SocketRooms) => {
  useEffect(() => {
    const join = () => {
      socket.emit('join-room', roomId);
    };

    if (socket.connected) {
      join();
    } else {
      socket.on('connect', join);
    }

    return () => {
      socket.off('connect', join);
      socket.emit('leave-room', roomId);
    };
  }, [roomId]);
};

export const useLeaveRoom = (roomId: SocketRooms) => {
  useEffect(() => {
    const leave = () => {
      socket.emit('leave-room', roomId);
    };

    if (socket.connected) {
      leave();
    } else {
      socket.on('connect', leave);
    }

    return () => {
      socket.off('connect', leave);
      socket.emit('leave-room', roomId);
    };
  }, [roomId]);
};

export const useSocket = () => {
  return socket;
};
