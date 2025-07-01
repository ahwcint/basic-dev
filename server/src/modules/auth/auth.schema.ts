import { z } from 'zod';

export const LoginSchema = z.object({
  username: z.string(),
  password: z.string(),
});
export type LoginDto = z.infer<typeof LoginSchema>;

export const COOKIE_TOKEN = 'token';
export const COOKIE_REFRESH_TOKEN = 'refresh_token';
