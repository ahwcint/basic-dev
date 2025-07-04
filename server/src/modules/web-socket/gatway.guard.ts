import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { BaseSocket } from './type';
import * as cookie from 'cookie';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<BaseSocket>();
    const cookieHeader = client.handshake.headers.cookie;

    if (!cookieHeader) throw new Error('cookie missing');

    const cookies = cookie.parse(cookieHeader) as Record<string, string>;

    const userTokenDecoded = jwt.decode(cookies['token']) as typeof client.data;

    if (!userTokenDecoded) {
      throw new WsException('Socket Unauthorized');
    }

    client.data = userTokenDecoded;

    if (!client.data.user) throw new Error('user missing');

    void client.join(client.data.user.id);
    return true;
  }
}
