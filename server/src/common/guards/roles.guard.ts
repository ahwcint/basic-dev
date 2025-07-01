import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';
import { Observable } from 'rxjs';
import { ROLE_GUARD_KEY } from '../decorators/roles.decorator';
import { BaseRequest } from '../schema/type';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<BaseRequest>();
    const user = request.user;
    const rolesAccess = this.reflector.getAllAndOverride<UserRole[]>(
      ROLE_GUARD_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (rolesAccess && !rolesAccess.includes(user.role))
      throw new ForbiddenException('Access Denied.');

    return true;
  }
}
