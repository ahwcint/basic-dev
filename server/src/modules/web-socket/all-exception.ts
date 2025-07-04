import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { BaseSocket } from './type';

@Catch()
export class AllWsExceptionsFilter extends BaseWsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<BaseSocket>();

    let errorResponse: {
      status: string;
      message?: string;
    } = {
      status: 'error',
      message: 'Unknown error',
    };

    if (exception instanceof WsException) {
      const error = exception.getError();
      errorResponse =
        typeof error === 'string'
          ? { status: 'error', message: error }
          : { status: 'error', ...error };
    } else if (exception instanceof Error) {
      errorResponse = {
        status: 'error',
        message: exception.message,
      };
    }

    client.emit('error', errorResponse);
  }
}
