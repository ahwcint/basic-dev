import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { COOKIE_REFRESH_TOKEN, COOKIE_TOKEN, LoginSchema } from './auth.schema';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMsg } from 'src/common/decorators/response-message.decorator';
import type { Response } from 'express';
import { Ctx, CtxRequest } from 'src/common/decorators/ctx.decorator';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Public()
  @ResponseMsg('User logged in successfully.')
  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const safePayload = LoginSchema.parse(body);

    const result = await this.authService.validate(safePayload, res);

    return result.user;
  }

  @ResponseMsg('Logged out successfully.')
  @Public()
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_REFRESH_TOKEN);
    res.clearCookie(COOKIE_TOKEN);
    return {};
  }

  @ResponseMsg('Create User successfully.')
  @Public()
  @Post('register')
  async register(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const safePayload = LoginSchema.parse(body);
    const user = await this.userService.create(safePayload);
    await this.authService.validate(safePayload, res);

    return user;
  }

  @ResponseMsg('Refresh token successfully.')
  @Public()
  @Post('refresh-token')
  async refreshToken(
    @Res({ passthrough: true }) res: Response,
    @Ctx() ctx: CtxRequest,
  ) {
    if (!ctx.refreshToken) throw new UnauthorizedException('Invalid token');
    const result = this.authService.validateToken(ctx.refreshToken);
    const user = await this.userService.findOne(result.sub);
    const newAccessToken = this.authService.refreshToken(result.sub, user, res);

    return { user, token: newAccessToken };
  }
}
