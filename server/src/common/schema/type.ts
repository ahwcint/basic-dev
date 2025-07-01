import { User } from '@prisma/client';
import { Request } from 'express';
import { z } from 'zod';

export const BaseListRequestSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export type BaseListRequestDto = z.infer<typeof BaseListRequestSchema>;

export type BaseRequest = Request & {
  user: User;
};
