import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ConcertService } from './concert.service';
import { BaseListRequestSchema, BaseRequest } from 'src/common/schema/type';
import {
  CreateConcertSchema,
  CreateReserveConcertSchema,
  GetConcertWithReservationDetailSchema,
} from './concert.schema';
import { ResponseMsg } from 'src/common/decorators/response-message.decorator';
import { RoleGuard } from 'src/common/guards/roles.guard';
import { ConcertAction, UserRole } from '@prisma/client';
import { Roles } from 'src/common/decorators/roles.decorator';

@UseGuards(RoleGuard)
@Controller('concert')
export class ConcertController {
  constructor(private readonly concertService: ConcertService) {}

  @Get()
  async listConcert(@Query() queries: object, @Req() req: BaseRequest) {
    const safePayload = BaseListRequestSchema.merge(
      GetConcertWithReservationDetailSchema,
    ).parse({
      ...queries,
      userId: req.user.id,
    });
    return this.concertService.listWithReservation(safePayload);
  }

  @Get(':id')
  async getConcert(@Param('id') id: string) {
    return this.concertService.get(id);
  }

  @ResponseMsg('Create concert successfully.')
  @Roles(UserRole.ADMIN)
  @Post()
  async createConcert(@Body() body: unknown) {
    const safeBody = CreateConcertSchema.parse(body);
    return this.concertService.create(safeBody);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  async softDeleteConcert(@Param('id') id: string) {
    return this.concertService.softDelete(id);
  }

  @ResponseMsg('Reserved.')
  @Post('reserve')
  async reserveConcert(@Body() body: object, @Req() req: BaseRequest) {
    const safePayload = CreateReserveConcertSchema.parse({
      ...body,
      userId: req.user.id,
      action: ConcertAction.RESERVE,
    });
    return this.concertService.createConcertAuditLog(safePayload);
  }

  @ResponseMsg('This concert has been canceled.')
  @Post('cancel')
  async cancelReserve(@Body() body: object, @Req() req: BaseRequest) {
    const safePayload = CreateReserveConcertSchema.parse({
      ...body,
      userId: req.user.id,
      action: ConcertAction.CANCEL,
    });
    return this.concertService.createConcertAuditLog(safePayload);
  }

  @Get('seats/audit-log')
  async listConcertAuditLog(@Query() queries: object) {
    const safePayload = BaseListRequestSchema.parse({
      ...queries,
    });
    return this.concertService.auditLog(safePayload);
  }

  @Get('/seats/information')
  async countSeatsInformation() {
    return this.concertService.countSeatsInformation();
  }
}
