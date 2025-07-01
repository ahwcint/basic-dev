import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/user/user.service';
import { ZodError } from 'zod';

@Injectable()
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let errors: unknown = null;

    if (exception instanceof PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          status = HttpStatus.CONFLICT;
          message = 'Username already existed.';
          errors = {
            target: exception.meta?.target,
          };
          break;
        case 'P2025':
          status = HttpStatus.NOT_FOUND;
          message = (exception.meta?.cause || 'Record not found') as string;
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = exception.message;
          break;
      }
    } else if (exception instanceof PrismaClientValidationError) {
      status = HttpStatus.BAD_REQUEST;
    } else if (exception instanceof ZodError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation failed';
      errors = exception.flatten().fieldErrors;
    } else if (exception instanceof NotFoundException) {
      status = HttpStatus.NOT_FOUND;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    if (exception instanceof UnauthorizedException) {
      status = HttpStatus.UNAUTHORIZED;
      const jwt = new JwtService({
        secret: process.env.JWT_SECRET || 'secret-1234',
      });
      const refreshToken =
        (exception.cause as { refreshToken: string })?.refreshToken || '';

      if (!refreshToken) {
        response.clearCookie('refresh_token', { path: '/' });
      } else {
        try {
          jwt.verify(refreshToken);
          const data = jwt.decode<{ sub: string }>(refreshToken);
          const user = await this.userService.findOne(data.sub);
          status = HttpStatus.UNPROCESSABLE_ENTITY;
          this.authService.refreshToken(data.sub, user, response);
        } catch {
          response.clearCookie('refresh_token', { path: '/' });
          response.clearCookie('token', { path: '/' });
        }
      }
    }

    response.status(400).json({
      success: false,
      statusCode: status,
      message,
      errors,
      timestamp,
      path: request.url,
      method: request.method,
    });
  }
}
