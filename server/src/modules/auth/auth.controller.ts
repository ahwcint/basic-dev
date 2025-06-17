import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { COOKIE_TOKEN, LoginSchema } from './auth.schema';
import { Public } from '../../common/decorators/public.decorator';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const safePayload = LoginSchema.parse(body);
    const { token } = await this.authService.login(safePayload);
    res.cookie(COOKIE_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
    });
    return safePayload;
  }

  @Public()
  @Post('logout')
  logout(@Body() body: unknown, @Res({ passthrough: true }) res: Response) {
    const safePayload = LoginSchema.parse(body);
    res.clearCookie(COOKIE_TOKEN);
    return this.authService.login(safePayload);
  }
}
