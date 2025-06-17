import { z } from 'zod';

export const CreateConcertSchema = z.object({
  name: z.string(),
  description: z.string(),
  totalSeats: z.coerce.number(),
});
export type CreateConcertDto = z.infer<typeof CreateConcertSchema>;

export const CreateReserveConcertSchema = z.object({
  concertId: z.string(),
  userId: z.string(),
});
export type CreateReserveConcertDto = z.infer<
  typeof CreateReserveConcertSchema
>;
