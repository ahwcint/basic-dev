import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateUserSchema } from './user.schema';
import { UserService } from './user.service';
import { BaseListRequestSchema } from 'src/common/schema/type';
import { AuthService } from '../auth/auth.service';
import { Public } from 'src/common/decorators/public.decorator';
import { ResponseMsg } from 'src/common/decorators/response-message.decorator';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ResponseMsg('User create successfully.')
  @Public()
  @Post()
  async create(@Body() body: unknown) {
    const safeBody = CreateUserSchema.parse(body);
    const user = await this.userService.create(safeBody);

    if (user && safeBody.redirect) {
      await this.authService.login({
        username: user.username,
      });
    }

    return user;
  }

  @Get()
  async list(@Query() queries: unknown) {
    const safePayload = BaseListRequestSchema.parse(queries);

    return this.userService.list(safePayload);
  }
}
