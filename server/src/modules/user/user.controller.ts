import { Body, Controller, Get, Patch, Query, Res } from '@nestjs/common';
import { ChangeRoleUserSchema } from './user.schema';
import { UserService } from './user.service';
import { BaseListRequestSchema } from 'src/common/schema/type';
import { AuthService } from '../auth/auth.service';
import { ResponseMsg } from 'src/common/decorators/response-message.decorator';
import type { Response } from 'express';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @ResponseMsg('Role changed')
  @Patch('change-role')
  async changeRoleUser(
    @Body() body: unknown,
    @Res({ passthrough: true }) res: Response,
  ) {
    const safePayload = ChangeRoleUserSchema.parse(body);
    const user = await this.userService.changeRoleUser(safePayload);
    this.authService.refreshToken(user.id, user, res);
    return user;
  }

  @Get()
  async list(@Query() queries: unknown) {
    const safePayload = BaseListRequestSchema.parse(queries);

    return this.userService.list(safePayload);
  }
}
