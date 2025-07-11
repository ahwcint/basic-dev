import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { BaseSocket } from '../type';
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

@Injectable()
@WebSocketGateway({
  namespace: '/hall-chat',
  path: '/hall-chat/socket.io',
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
  }

  @SubscribeMessage('hall-chat')
  handleAlert(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody()
    payload: { msg: string; id: string; sender: string | undefined },
  ) {
    const createdAt = Date.now();
    client.broadcast.to('hall-chat').emit('message', { ...payload, createdAt });
  }

  afterInit(server: Server) {
    Logger.log('SocketGateway initialized', 'SocketGateWay');
    server.use(this.auth.use);
  }

  handleConnection(client: BaseSocket) {
    console.log('Client connected with:', client.id);
  }

  handleDisconnect(client: BaseSocket) {
    console.log('Client disconnected:', client.id);
    this.handleLeaveRoom(client, 'hall-chat');
  }
}
