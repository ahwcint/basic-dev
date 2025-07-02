'use client';

import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket({ userId }: { userId: string }) {
  if (!socket || !socket.connected) {
    socket = io('http://www.aummer.space/api/socket.io', {
      path: '/api/socket.io',
      transports: ['websocket'],
      withCredentials: true,
      query: { userId },
    });

    socket.on('connect', () => {
      if (socket?.connected) console.log('✅ Socket connected:', userId);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    socket.on('error', (error) => {
      console.log('❌ Socket error', error);
    });
  }

  return socket;
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    console.log('🔌 Socket manually disconnected');
    socket = null;
  }
};
