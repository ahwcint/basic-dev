import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangeRoleUserDto, CreateUserDto } from './user.schema';
import { BaseListRequestDto } from 'src/common/schema/type';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ username }: CreateUserDto) {
    return this.prisma.user.create({
      data: { username },
    });
  }

  async list({ page = 0, pageSize }: BaseListRequestDto) {
    return this.prisma.user.findMany({
      skip: Math.max(page - 1, 0),
      take: pageSize,
    });
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async changeRoleUser(payload: ChangeRoleUserDto) {
    return this.prisma.user.update({
      where: {
        id: payload.userId,
      },
      data: {
        role: payload.role,
      },
    });
  }
}
