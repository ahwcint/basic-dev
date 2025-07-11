'use client';

import { createContext, PropsWithChildren, useContext, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SocketRooms } from './type';
import { useAuth } from '@/lib/context/auth-context';
import { ComponentLoading } from '@/components/common/component-loading';

export type SocketResponse<T> = { data: T; success: boolean };

// let retry_count = 0;
// const MAX_RETRY = 3;

// const onError = async (res: { code: HttpStatusCode; message: string }) => {
//   if (res.code === HttpStatusCode.Unauthorized) {
//     if (retry_count < MAX_RETRY) {
//       await refreshTokenService();
//       socket.disconnect();
//       socket.connect();
//       retry_count++;
//       return;
//     }
//   }
//   toast.error(res.message || 'Socket error occurred');
// };

// const onConnect = () => {
//   console.log('connected');
// };

// socket!.on('connect', onConnect);
// socket!.on('error', onError);
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
  const socket = useSocket();
  const isJoined = useRef(false);
  useEffect(() => {
    if (!socket) return;

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
  }, [roomId, socket]);

  return {
    isJoined: isJoined.current,
  };
};

const socketNameSpaceMap = new Map<string, Socket>();

const SocketContext = createContext<Socket | null>(null);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) throw new Error('useSocket must be used within a SocketProvider');
  return socket;
};

export const SocketProvider = ({
  children,
  namespace,
}: PropsWithChildren & { namespace: string }) => {
  const { token } = useAuth();
  let socketRef = socketNameSpaceMap.get(namespace);

  if (!socketRef) {
    const socket = io(`${process.env.NEXT_PUBLIC_BACKEND_API}/${namespace}`, {
      path: `/${namespace}/socket.io`,
      transports: ['websocket'],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      auth: {
        token,
      },
    });

    socketNameSpaceMap.set(namespace, socket);
    socketRef = socket;
    socket.on('connect', () => {
      console.log('connected');
    });
  }

  useEffect(() => {
    return () => {
      if (!socketRef.connected) return;
      socketRef?.disconnect();
      socketNameSpaceMap.delete(namespace);
    };
  }, [namespace, socketRef]);

  if (!socketRef || !token)
    return (
      <div className="flex size-full flex-col gap-2">
        <ComponentLoading className="grow" />
        <ComponentLoading className="basis-[2.5rem]" />
      </div>
    );
  return <SocketContext.Provider value={socketRef}>{children}</SocketContext.Provider>;
};
