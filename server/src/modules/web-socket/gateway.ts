import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { BaseSocket } from './type';
import {
  Injectable,
  Logger,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AllWsExceptionsFilter } from './all-exception';
import { randomUUID } from 'crypto';
import { WsAuthGuard } from './gateway.guard';
import { WsAuthInterceptor } from './gateway.interceptor';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://www.aummer.space'],
    credentials: true,
  },
})
@UseInterceptors(WsAuthInterceptor)
@UseFilters(AllWsExceptionsFilter)
@UseGuards(WsAuthGuard)
export class Gateway {
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
    if (!this.socketRoomMap.has(client.id)) {
      this.socketRoomMap.set(client.id, new Set());
    }
    if (this.socketRoomMap.get(client.id)?.has(roomId)) return;
    this.socketRoomMap.get(client.id)!.add(roomId);

    client.broadcast.to(roomId).emit('message', {
      id: randomUUID(),
      msg: `${client.data.user.username} has joined`,
      system: true,
    });
    void client.join(roomId);
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody() roomId: string,
  ) {
    if (!this.socketRoomMap.get(client.id)?.has(roomId)) return;
    this.socketRoomMap.get(client.id)!.delete(roomId);

    client.broadcast.to(roomId).emit('message', {
      id: randomUUID(),
      msg: `${client.data.user.username} just leaved`,
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

  afterInit() {
    Logger.log('SocketGateway initialized', 'SocketGateWay');
  }

  handleConnection(client: BaseSocket) {
    console.log('Client connected with:', client.id);
  }

  handleDisconnect(client: BaseSocket) {
    console.log('Client disconnected:', client.id);
    this.handleLeaveRoom(client, 'hall-chat');
  }
}
