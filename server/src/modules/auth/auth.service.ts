import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import type { Response } from 'express';
import { COOKIE_REFRESH_TOKEN, COOKIE_TOKEN } from './auth.schema';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * use for validate username and password
   */
  async validate(
    { username, password }: { username: string; password: string },
    /**
     * use res for set cookies
     */
    res: Response | undefined,
  ) {
    /**
     * 1. find user and prevent time tracking
     */
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      // decoy for time tracking api
      await bcrypt.compare(
        password,
        '$2b$10$invalidsaltstring1234567890fakelolz',
      );
      throw new BadRequestException('username or password invalid');
    }

    /**
     * 2. separate password from user and compare password with bcrybt
     */
    const { password: hashedPassword, ...safeUser } = user;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword)
      throw new BadRequestException('username or password invalid');

    /**
     * 3. create token for user
     */
    const payload = { sub: user.id };
    const token = this.jwtService.sign(
      { ...payload, user: safeUser },
      { expiresIn: '15m' },
    );
    const refresh_token = this.jwtService.sign(payload, { expiresIn: '7d' });
    const isProduction = process.env.NODE_ENV === 'production';

    /**
     * 4. set cookie via response
     */
    if (res) {
      res.cookie(COOKIE_REFRESH_TOKEN, refresh_token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      res.cookie(COOKIE_TOKEN, token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        maxAge: 1000 * 60 * 15,
      });
    }
    return {
      token,
      refresh_token,
      user: safeUser,
    };
  }

  /**
   * use for verify valid token
   */
  validateToken(token: string) {
    return this.jwtService.verify(token) as unknown as {
      sub: string;
      user: User;
      exp: number;
      iat: number;
    };
  }

  refreshToken(sub: User['id'], user: unknown, res: Response) {
    const newAccessToken = this.jwtService.sign(
      { sub, user },
      { expiresIn: '15m' },
    );
    const isProduction = process.env.NODE_ENV === 'production';

    res.cookie(COOKIE_TOKEN, newAccessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      path: '/',
      maxAge: 1000 * 60 * 15,
    });
    return newAccessToken;
  }
}
