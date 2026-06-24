import { z } from 'zod';
import { OrderStatus } from '@prisma/client';

export const updateOrderStatusSchema = z.object({
  estado: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDIENTE: [OrderStatus.PAGADO, OrderStatus.CANCELADO],
  PAGADO: [OrderStatus.ENVIADO, OrderStatus.CANCELADO],
  ENVIADO: [OrderStatus.ENTREGADO],
  ENTREGADO: [],
  CANCELADO: [],
};

export function isValidStatusTransition(from: OrderStatus, to: OrderStatus): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
