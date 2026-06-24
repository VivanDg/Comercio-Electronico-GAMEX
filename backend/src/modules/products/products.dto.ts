import { z } from 'zod';

export const createProductSchema = z.object({
  nombre: z.string().min(2).max(200),
  descripcion: z.string().max(2000).optional(),
  precio: z.number().positive('El precio debe ser mayor a 0'),
  imagen: z.string().url('URL de imagen inválida').optional(),
  categoryId: z.number().int().positive(),
  stock: z.number().int().min(0).default(0),
});

export const updateProductSchema = createProductSchema.partial();

export const productFilterSchema = z.object({
  search: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(12),
  sortBy: z.enum(['nombre', 'precio', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type ProductFilterDto = z.infer<typeof productFilterSchema>;
