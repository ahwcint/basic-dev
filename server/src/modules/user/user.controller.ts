import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserSchema } from './user.schema';
import { UserService } from './user.service';
import { BaseListRequestSchema } from 'src/common/schema/type';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() body: unknown) {
    const safeBody = CreateUserSchema.parse(body);

    return this.userService.create(safeBody);
  }

  @Get()
  async list(@Query() queries: unknown) {
    const safePayload = BaseListRequestSchema.parse(queries);

    return this.userService.list(safePayload);
  }
}
