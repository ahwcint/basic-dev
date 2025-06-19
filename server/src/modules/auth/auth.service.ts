import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import { COOKIE_REFRESH_TOKEN, COOKIE_TOKEN } from './auth.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validate(
    { username }: { username: string },
    /**
     * use res for set cookies
     */
    res: Response | undefined,
  ) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const payload = { sub: user.id };

    const token = this.jwtService.sign(
      { ...payload, user },
      { expiresIn: '15m' },
    );
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });

    if (res) {
      res.cookie(COOKIE_REFRESH_TOKEN, refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.cookie(COOKIE_TOKEN, token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/',
        maxAge: 1000 * 60 * 15,
      });
    }
    return {
      token,
      refresh_token,
    };
  }

  validateToken(token: string) {
    return this.jwtService.verify(token) as unknown as {
      sub: string;
      exp: number;
      iat: number;
    };
  }

  refreshToken(sub: string, user: unknown, res: Response) {
    const newAccessToken = this.jwtService.sign(
      { sub, user },
      { expiresIn: '15m' },
    );
    res.cookie(COOKIE_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });
    return newAccessToken;
  }
}
