import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto, CreateReserveConcertDto } from './concert.schema';
import { BaseListRequestDto } from 'src/common/schema/type';
import { ConcertAction } from '@prisma/client';

@Injectable()
export class ConcertService {
  constructor(private readonly prisma: PrismaService) {}

  async create(payload: CreateConcertDto) {
    return this.prisma.concert.create({
      data: {
        ...payload,
      },
    });
  }

  async list({ page = 0, pageSize }: BaseListRequestDto) {
    return this.prisma.concert.findMany({
      skip: Math.max(page - 1, 0),
      take: pageSize,
      where: {
        active: true,
      },
    });
  }

  async get(id: string) {
    return this.prisma.concert.findUnique({
      where: {
        id,
      },
    });
  }

  async softDelete(id: string) {
    return this.prisma.concert.update({
      where: {
        id,
      },
      data: {
        active: false,
      },
    });
  }

  async reserveConcert({ concertId, userId }: CreateReserveConcertDto) {
    return this.prisma.auditLogConcert.create({
      data: {
        action: ConcertAction.RESERVE,
        concertId,
        userId,
      },
    });
  }

  async cancelReserve(id: string) {
    return this.prisma.auditLogConcert.update({
      where: {
        id,
      },
      data: {
        action: ConcertAction.CANCEL,
      },
    });
  }

  async countTotalSeatsReserve(id: string) {
    return this.prisma.auditLogConcert.count({
      where: {
        concertId: id,
        action: 'RESERVE',
      },
    });
  }
}
