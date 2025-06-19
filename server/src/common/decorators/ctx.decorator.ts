import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export const Ctx = createParamDecorator(
  (key: string | undefined, ctx: ExecutionContext): CtxRequest => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const token = request.cookies?.['token'] as string | undefined;
    const refreshToken = request.cookies?.['refresh_token'] as
      | string
      | undefined;
    return {
      token,
      refreshToken,
    };
  },
);

export type CtxRequest = {
  token: string | undefined;
  refreshToken: string | undefined;
};
