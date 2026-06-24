import { z } from 'zod';
import { Role } from '@prisma/client';

export const updateUserSchema = z.object({
  nombre: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
});

export const updateRoleSchema = z.object({
  rol: z.nativeEnum(Role),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;
