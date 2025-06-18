import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { CreateUserSchema } from './user.schema';
import { UserService } from './user.service';
import { BaseListRequestSchema } from 'src/common/schema/type';
import { AuthService } from '../auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMsg } from 'src/common/decorators/response-message.decorator';
import type { Response } from 'express';
import { COOKIE_TOKEN } from '../auth/auth.schema';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ResponseMsg('User create successfully.')
  @Public()
  @Post()
  async create(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const safeBody = CreateUserSchema.parse(body);
    const user = await this.userService.create(safeBody);

    if (user && safeBody.redirect) {
      const { token } = await this.authService.validate({
        username: user.username,
      });

      res.cookie(COOKIE_TOKEN, token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
      });
    }

    return user;
  }

  @Get()
  async list(@Query() queries: unknown) {
    const safePayload = BaseListRequestSchema.parse(queries);

    return this.userService.list(safePayload);
  }
}
