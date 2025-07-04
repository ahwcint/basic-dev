'use client';

import { useAuth } from '@/lib/context/AuthContext';
import { getSocket } from '@/lib/socket';
import { useCallback, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { SocketRooms } from './type';

type WebSocketProp = {
  join?: SocketRooms[];
};

export function useWebSocket(props?: WebSocketProp) {
  const { socket, isOnline } = useInitializedSocket();

  const joinRoom = useCallback(
    (roomId: SocketRooms) => {
      socket?.emit('join-room', roomId);
    },
    [socket],
  );

  const leaveRoom = useCallback(
    (roomId: SocketRooms) => {
      socket?.emit('leave-room', roomId);
    },
    [socket],
  );

  useEffect(() => {
    const join = props?.join;
    if (!socket || !join?.length) return;

    for (const roomId of join) {
      socket.emit('join-room', roomId);
    }
  }, [props?.join, socket]);

  return {
    isOnline,
    socket,
    joinRoom,
    leaveRoom,
  };
}

function useInitializedSocket() {
  const { user } = useAuth();
  const [socket, setSocket] = useState<null | Socket>(null);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (!socket) {
      setSocket(getSocket({ userId: user.id }));
      return;
    }

    const handleClients = (msg: unknown) => {
      console.log('[SERVER]', msg);
    };
    const handleError = (msg: unknown) => {
      console.log('[ERROR]', msg);
    };
    const handleConnect = () => {
      setIsOnline(socket.connected);
    };

    socket.on('clients', handleClients);
    socket.on('error', handleError);
    socket.on('connect', handleConnect);

    return () => {
      socket.off('clients', handleClients);
      socket.off('error', handleError);
      socket.off('connect', handleConnect);
    };
  }, [user, socket]);

  return {
    isOnline,
    socket,
  };
}
