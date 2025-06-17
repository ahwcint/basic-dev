import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { BaseListRequestSchema } from 'src/common/schema/type';
import {
  CreateConcertSchema,
  CreateReserveConcertSchema,
} from './concert.schema';

@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get(':id')
  async getConcert(@Param('id') id: string) {
    return this.concertService.get(id);
  }

  @Get()
  async listConcert(@Query() queries: unknown) {
    const safePayload = BaseListRequestSchema.parse(queries);
    return this.concertService.list(safePayload);
  }

  @Post()
  async createConcert(@Body() body: unknown) {
    const safeBody = CreateConcertSchema.parse(body);
    return this.concertService.create(safeBody);
  }

  @Patch(':id')
  async softDeleteConcert(@Param('id') id: string) {
    return this.concertService.softDelete(id);
  }

  @Post('reserve')
  async reserveConcert(@Body() body: unknown) {
    const safePayload = CreateReserveConcertSchema.parse(body);
    return this.concertService.reserveConcert(safePayload);
  }

  @Patch('cancel/:id')
  async cancelReserve(@Param('id') id: string) {
    return this.concertService.cancelReserve(id);
  }

  @Get('seats/:id')
  async seatsInformation(@Param('id') id: string) {
    const concert = await this.getConcert(id);

    if (!concert) throw new BadRequestException('Concert not found');

    const totalSeats = concert.totalSeats;
    const reservedSeats = await this.concertService.countTotalSeatsReserve(id);
    const availableSeats = totalSeats - reservedSeats;

    return {
      reservedSeats,
      totalSeats,
      availableSeats,
    };
  }
}
