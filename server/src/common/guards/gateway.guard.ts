import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { BaseSocket } from '../../modules/web-socket/type';
import { WsUnauthorizedException } from '../decorators/ws-unauthorized-exception';
import { decode } from 'jsonwebtoken';

@Injectable()
export class WsAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const client = context.switchToWs().getClient<BaseSocket>();
    const token = client.handshake?.auth?.token as string | undefined;
    if (!token) throw new WsUnauthorizedException('token missing');
    const userTokenDecoded = decode(token) as typeof client.data;

    if (!userTokenDecoded || !userTokenDecoded.sub) {
      throw new WsUnauthorizedException('invalid token');
    }

    client.data = userTokenDecoded;

    // check user if existed or user expired
    if (!client.data.user) throw new WsUnauthorizedException('user missing');
    if (isExpiredDate(client.data.exp))
      throw new WsUnauthorizedException('token expired');

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
