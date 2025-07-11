import { WsException } from '@nestjs/websockets';

export class WsUnauthorizedException extends WsException {
  constructor(message = 'Unauthorized') {
    super(message);
  }
}
