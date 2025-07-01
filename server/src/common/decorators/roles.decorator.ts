import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@prisma/client';

export const ROLE_GUARD_KEY = 'role-guard-access';
export const Roles = (...rolesAccess: UserRole[]) =>
  SetMetadata(ROLE_GUARD_KEY, rolesAccess);
