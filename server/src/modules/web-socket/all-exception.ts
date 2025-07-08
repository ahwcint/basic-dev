import {
  ArgumentsHost,
  Catch,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { BaseSocket } from './type';

@Catch()
export class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<BaseSocket>();

    let errorResponse: {
      success: boolean;
      message?: string;
      code: HttpStatus;
    } = {
      success: false,
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Unknown error',
    };

    if (exception instanceof WsException) {
      const error = exception.getError();
      errorResponse = (
        typeof error === 'string' ? { message: error } : { ...error }
      ) as typeof errorResponse;
      errorResponse.code = HttpStatus.INTERNAL_SERVER_ERROR;
    } else if (exception instanceof UnauthorizedException) {
      errorResponse.message = exception.message || 'Unauthorized';
      errorResponse.code = HttpStatus.UNAUTHORIZED;
    } else if (exception instanceof Error) {
      errorResponse.message = exception.message;
    }

    client.emit('error', { ...errorResponse, success: false });
    return { ...errorResponse, success: false };
  }
}
