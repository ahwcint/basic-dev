import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseSocket } from './type';
import * as jwt from 'jsonwebtoken';
import { parse } from 'cookie';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<BaseSocket>();
    const cookies = parse(client.handshake.headers.cookie || '');
    const token = cookies['token'];

    if (!token) throw new UnauthorizedException('token missing');

    const userTokenDecoded = jwt.decode(token) as typeof client.data;

    if (!userTokenDecoded) {
      throw new UnauthorizedException('Socket Unauthorized');
    }

    client.data = userTokenDecoded;

    if (!client.data.user) throw new Error('user missing');
    if (isExpiredDate(client.data.exp)) throw new UnauthorizedException();

    void client.join(client.data.user.id);
    return true;
  }
}

function isExpiredDate(
  expDate: BaseSocket['data']['exp'] | undefined,
): boolean {
  if (!expDate) return true;

  const nowSeconds = Math.floor(Date.now() / 1000); // convert to second
  return nowSeconds > expDate;
}
