import { z } from 'zod';

export const BaseListRequestSchema = z.object({
  page: z.coerce.number().optional(),
  pageSize: z.coerce.number().optional(),
});

export type BaseListRequestDto = z.infer<typeof BaseListRequestSchema>;
