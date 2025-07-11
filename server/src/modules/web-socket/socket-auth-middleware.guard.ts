import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsUnauthorizedException } from 'src/common/decorators/ws-unauthorized-exception';
import { AuthService } from 'src/modules/auth/auth.service';

@Injectable()
export class SocketAuthMiddleware {
  constructor(private readonly authService: AuthService) {}

  use = (socket: Socket, next: (err?: any) => void) => {
    try {
      const token = socket.handshake?.auth?.token as string;
      if (!token) return next(new Error('No token'));

      const decoded = this.authService.validateToken(token);
      socket.data = decoded;

      next();
    } catch {
      next(new WsUnauthorizedException('Unauthorized'));
    }
  };
}
