import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { BaseSocket } from './type';
import { UseFilters } from '@nestjs/common';
import { AllWsExceptionsFilter } from './all-exception';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'https://www.aummer.space'],
    credentials: true,
  },
})
@UseFilters(new AllWsExceptionsFilter())
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('msg-to-everyone')
  handleMessage(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody() payload: string,
  ) {
    client.broadcast.emit('clients', payload);
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
    void client.join(roomId);
  }

  @SubscribeMessage('send-hall-chat')
  handleAlert(
    @ConnectedSocket() client: BaseSocket,
    @MessageBody()
    payload: { msg: string; id: string; sender: string | undefined },
  ) {
    client.broadcast.emit('receive-hall-chat', payload);
  }

  afterInit() {
    console.log('ChatGateway initialized');
  }

  handleConnection(client: BaseSocket) {
    const userId = client.handshake.query.userId as string;
    if (!userId) {
      client.emit('error', {
        status: 'error',
        massage: 'userId is required',
      });
      client.disconnect();
      return;
    }
    void client.join(userId);
    client.data.userId = userId;

    console.log('Client connected:', userId);
  }

  handleDisconnect(client: BaseSocket) {
    console.log('Client disconnected:', client.data.userId);
  }
}
