import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { BaseSocket, SafeUser } from '../type';
import {
  Injectable,
  Logger,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { WsAuthGuard } from 'src/common/guards/gateway.guard';
import { AllWsExceptionsFilter } from 'src/common/filters/all-ws-exception';
import { WsAuthInterceptor } from 'src/common/interceptors/gateway.interceptor';
import { SocketAuthMiddleware } from '../socket-auth-middleware.guard';

const NAMESPACE = 'hall-chat' as const;

@Injectable()
@WebSocketGateway({
  namespace: `/${NAMESPACE}`,
  path: `/${NAMESPACE}`,
  cors: {
    origin: ['http://localhost:3000', 'https://www.aummer.space'],
    credentials: true,
  },
})
@UseGuards(WsAuthGuard)
@UseFilters(AllWsExceptionsFilter)
@UseInterceptors(WsAuthInterceptor)
export class ChatGateway {
  constructor(private auth: SocketAuthMiddleware) {}
  @WebSocketServer()
  server: Server;

  private socketRoomMap = new Map<string, Set<string>>();
  private activeUsers = new Map<string, SafeUser>();

  @SubscribeMessage('msg-to-everyone')
  handleMessage(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody() payload: string,
  ) {
    client.broadcast.to(client.id).emit('clients', payload);
  }

  @SubscribeMessage('rooms')
  handleCreateRoom(@ConnectedSocket() client: BaseSocket) {
    const rooms = Array.from(client.rooms);
    return rooms;
  }

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody() roomId: string,
  ) {
    if (!this.socketRoomMap.has(client.data.user.id)) {
      this.socketRoomMap.set(client.data.user.id, new Set());
    }
    if (this.socketRoomMap.get(client.data.user.id)?.has(roomId)) return;
    this.socketRoomMap.get(client.data.user.id)!.add(roomId);

    client.broadcast.to(roomId).emit('message', {
      id: randomUUID(),
      msg: `${client.data.user.username} has online`,
      system: true,
    });

    void client.join(roomId);

    // message for active user
    this.handleListActiveUser();
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody() roomId: string,
  ) {
    if (!this.socketRoomMap.get(client.data.user.id)?.has(roomId)) return;
    this.socketRoomMap.get(client.data.user.id)!.delete(roomId);

    client.broadcast.to(roomId).emit('message', {
      id: randomUUID(),
      msg: `${client.data.user.username} just offline`,
      system: true,
    });
    void client.leave(roomId);
    this.handleListActiveUser();
  }

  @SubscribeMessage(NAMESPACE)
  handleAlert(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody()
    payload: { msg: string; id: string; sender: string | undefined },
  ) {
    const createdAt = Date.now();
    client.broadcast.to(NAMESPACE).emit('message', { ...payload, createdAt });
  }

  handleListActiveUser() {
    const activeUsers: SafeUser[] = [];

    this.activeUsers.forEach((user) => {
      activeUsers.push(user);
    });

    this.server.to(NAMESPACE).emit('list-active-user', activeUsers);
  }

  afterInit(server: Server) {
    Logger.log('SocketGateway initialized', 'SocketGateWay');
    server.use(this.auth.use);
  }

  handleConnection(client: BaseSocket) {
    this.activeUsers.set(client.data.user.id, client.data.user);
    console.log('Client connected with:', client.id);
  }

  handleDisconnect(client: BaseSocket) {
    console.log('Client disconnected:', client.id);
    this.activeUsers.delete(client.data.user.id);
    this.handleLeaveRoom(client, NAMESPACE);
  }
}
