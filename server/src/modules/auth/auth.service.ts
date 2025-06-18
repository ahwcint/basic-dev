import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validate({ username }: { username: string }) {
    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });

    if (!user) throw new BadRequestException('User not found');

    const payload = { sub: username };
    return {
      token: this.jwtService.sign(payload),
    };
  }
}
