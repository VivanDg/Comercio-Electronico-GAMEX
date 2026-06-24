import { z } from 'zod';

export const createPaymentSchema = z.object({
  orderId: z.number().int().positive(),
});

export type CreatePaymentDto = z.infer<typeof createPaymentSchema>;
