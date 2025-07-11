import { Global, Module } from '@nestjs/common';
import { ChatGateway } from './namespace/chat-gateway';
import { AuthModule } from '../auth/auth.module';
import { SocketAuthMiddleware } from './socket-auth-middleware.guard';

@Global()
@Module({
  providers: [ChatGateway, SocketAuthMiddleware],
  exports: [ChatGateway],
  imports: [AuthModule],
})
export class WebSocketModule {}
