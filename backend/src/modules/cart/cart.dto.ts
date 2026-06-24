import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  cantidad: z.number().int().min(1, 'La cantidad mínima es 1').default(1),
});

export const updateCartItemSchema = z.object({
  cantidad: z.number().int().min(1, 'La cantidad mínima es 1'),
});

export type AddToCartDto = z.infer<typeof addToCartSchema>;
export type UpdateCartItemDto = z.infer<typeof updateCartItemSchema>;
