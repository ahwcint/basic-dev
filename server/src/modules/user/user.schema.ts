import { z } from 'zod';

export const CreateUserSchema = z.object({
  username: z.string().min(1),
  redirect: z.boolean().default(true),
});

export type CreateUserDto = z.infer<typeof CreateUserSchema>;
