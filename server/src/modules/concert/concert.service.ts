import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConcertDto, CreateReserveConcertDto } from './concert.schema';
import { BaseListRequestDto } from 'src/common/schema/type';

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
      orderBy: {
        createdAt: 'desc',
      },
      where: {
        active: true,
      },
    });
  }

  async listWithReservation({
    page = 0,
    pageSize,
    userId,
  }: BaseListRequestDto & { userId: string }) {
    return this.prisma.concert.findMany({
      include: {
        auditLogConcerts: {
          where: { userId },
          select: { id: true, action: true },
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      skip: Math.max(page - 1, 0),
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
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

  async createConcertAuditLog({
    concertId,
    userId,
    action,
  }: CreateReserveConcertDto) {
    return this.prisma.auditLogConcert.create({
      data: {
        action,
        concertId,
        userId,
      },
    });
  }

  async countSeatsInformation() {
    const total = this.prisma.concert.aggregate({
      _sum: {
        totalSeats: true,
      },
      where: {
        active: true,
      },
    });
    const reserve = this.prisma.auditLogConcert.count({
      where: {
        action: 'RESERVE',
      },
    });
    const cancel = this.prisma.auditLogConcert.count({
      where: {
        action: 'CANCEL',
      },
    });

    const result = await Promise.all([total, reserve, cancel]);

    return {
      totalSeats: result[0]._sum.totalSeats ?? 0,
      reserve: result[1],
      cancel: result[2],
    };
  }

  async auditLog({ page = 0, pageSize }: BaseListRequestDto) {
    return this.prisma.auditLogConcert.findMany({
      include: {
        user: {
          select: {
            username: true,
          },
        },
        concert: {
          select: {
            name: true,
          },
        },
      },
      skip: Math.max(page - 1, 0),
      take: pageSize,
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
