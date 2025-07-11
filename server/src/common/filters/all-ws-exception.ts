import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { BaseSocket } from '../../modules/web-socket/type';
import { WsUnauthorizedException } from '../decorators/ws-unauthorized-exception';

@Catch(WsException, WsUnauthorizedException)
export class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<BaseSocket>();
    let errorResponse: {
      data: unknown;
      code: HttpStatus;
      success: boolean;
    } = {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      data: null,
      success: false,
    };

    if (exception instanceof WsException) {
      const error = exception.getError();
      errorResponse = (
        typeof error === 'string' ? { message: error } : { ...error }
      ) as typeof errorResponse;
      errorResponse.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (exception instanceof WsUnauthorizedException) {
      errorResponse.data = exception.message || 'Unauthorized';
      errorResponse.code = HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof Error) {
      errorResponse.data = exception.message;
    }

    client.emit('error', errorResponse);
    super.catch(exception, host);
  }
}
