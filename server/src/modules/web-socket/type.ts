import type { DefaultEventsMap, Socket } from 'socket.io';

export type BaseSocket<T = BaseSocketData> = Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  T
>;

export type BaseSocketData = {
  userId?: string;
};
