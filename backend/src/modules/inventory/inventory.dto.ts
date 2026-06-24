import { z } from 'zod';

export const updateStockSchema = z.object({
  stock: z.number().int().min(0, 'El stock no puede ser negativo'),
});

export const adjustStockSchema = z.object({
  cantidad: z.number().int().refine((v) => v !== 0, 'La cantidad no puede ser 0'),
  motivo: z.string().max(200).optional(),
});

export type UpdateStockDto = z.infer<typeof updateStockSchema>;
export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
