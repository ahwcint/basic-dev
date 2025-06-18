import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { COOKIE_TOKEN, LoginSchema } from './auth.schema';
import { Public } from '../../common/decorators/public.decorator';
import { ResponseMsg } from 'src/common/decorators/response-message.decorator';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @ResponseMsg('User logged in successfully.')
  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const safePayload = LoginSchema.parse(body);

    const { token } = await this.authService.login(safePayload);
    res.cookie(COOKIE_TOKEN, token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
    });

    return safePayload;
  }

  @ResponseMsg('Logged out successfully.')
  @Public()
  @Get('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie(COOKIE_TOKEN);
    return {};
  }
}
