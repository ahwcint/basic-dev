import type { User } from '@prisma/client';
import type { DefaultEventsMap, Socket } from 'socket.io';

export type BaseSocket<T = BaseSocketData> = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  T
>;

export type BaseSocketData = {
  sub: string;
  user: Omit<User, 'password'>;
  iat: number;
  exp: number;
};
