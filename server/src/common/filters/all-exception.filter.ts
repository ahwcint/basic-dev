import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
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
          message = 'Duplicate field value violates unique constraint';
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
    } else if (exception instanceof Error) {
      message = exception.message;
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
