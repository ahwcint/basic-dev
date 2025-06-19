import { UserRole } from '@prisma/client';
import { nativeEnum, z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(1),
});
export type CreateUserDto = z.infer<typeof CreateUserSchema>;

export const ChangeRoleUserSchema = z.object({
  role: nativeEnum(UserRole),
  userId: z.string().min(1),
});
export type ChangeRoleUserDto = z.infer<typeof ChangeRoleUserSchema>;
