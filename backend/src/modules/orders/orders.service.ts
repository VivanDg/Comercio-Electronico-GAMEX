import { OrderStatus } from '@prisma/client';
import { NotFoundError, ValidationError, ForbiddenError } from '../../common/errors/AppError';
import { buildMeta } from '../../common/types';
import { logOperation } from '../../common/services/operationLog.service';
import { ordersRepository } from './orders.repository';
import { UpdateOrderStatusDto, isValidStatusTransition } from './orders.dto';
import { cartService } from '../cart/cart.service';
import { inventoryService } from '../inventory/inventory.service';
import { notificationsService } from '../notifications/notifications.service';

export class OrdersService {
  async createFromCart(userId: number) {
    const cart = await cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new ValidationError('El carrito está vacío');
    }

    await inventoryService.validateStock(
      cart.items.map((item) => ({ productId: item.productId, cantidad: item.cantidad }))
    );

    const cartItems = cart.items.map((item) => ({
      productId: item.productId,
      cantidad: item.cantidad,
      precio: item.product.precio,
    }));

    const order = await ordersRepository.createFromCart(userId, cartItems);

    await cartService.clearCart(userId);

    await logOperation({
      action: 'CREATE_ORDER',
      entity: 'Order',
      entityId: order.id,
      userId,
      details: { total: Number(order.total), items: cartItems.length },
    });

    return this.formatOrder(order);
  }

  async getMyOrders(userId: number, page = 1, limit = 10) {
    const { orders, total, page: p, limit: l } = await ordersRepository.findAll({
      userId,
      page,
      limit,
    });

    return {
      orders: orders.map(this.formatOrder),
      meta: buildMeta(total, p, l),
    };
  }

  async getAll(page = 1, limit = 10, estado?: OrderStatus) {
    const { orders, total, page: p, limit: l } = await ordersRepository.findAll({
      page,
      limit,
      estado,
    });

    return {
      orders: orders.map(this.formatOrder),
      meta: buildMeta(total, p, l),
    };
  }

  async getById(id: number, userId?: number, isAdmin = false) {
    const order = userId && !isAdmin
      ? await ordersRepository.findByIdAndUserId(id, userId)
      : await ordersRepository.findById(id);

    if (!order) throw new NotFoundError('Pedido no encontrado');
    return this.formatOrder(order);
  }

  async updateStatus(id: number, dto: UpdateOrderStatusDto, adminId: number) {
    const order = await ordersRepository.findById(id);
    if (!order) throw new NotFoundError('Pedido no encontrado');

    if (!isValidStatusTransition(order.estado, dto.estado)) {
      throw new ValidationError(
        `Transición de estado inválida: ${order.estado} → ${dto.estado}`
      );
    }

    const updated = await ordersRepository.updateStatus(id, dto.estado);

    await logOperation({
      action: 'UPDATE_STATUS',
      entity: 'Order',
      entityId: id,
      userId: adminId,
      details: { from: order.estado, to: dto.estado },
    });

    notificationsService
      .sendOrderStatusEmail(updated.user.email, updated.user.nombre, id, dto.estado)
      .catch(() => {});

    return this.formatOrder(updated);
  }

  async validateOrderAccess(orderId: number, userId: number, isAdmin: boolean) {
    const order = await ordersRepository.findById(orderId);
    if (!order) throw new NotFoundError('Pedido no encontrado');
    if (!isAdmin && order.userId !== userId) {
      throw new ForbiddenError('No tienes acceso a este pedido');
    }
    return order;
  }

  private formatOrder(order: {
    id: number;
    userId: number;
    fecha: Date;
    total: { toNumber?: () => number } | number | string;
    estado: OrderStatus;
    createdAt?: Date;
    items: Array<{
      id: number;
      productId: number;
      cantidad: number;
      subtotal: { toNumber?: () => number } | number | string;
      product: { id: number; nombre: string; imagen?: string | null; precio?: unknown };
    }>;
    payment?: { id: number; monto: unknown; estado: string; metodo: string; preferenceId?: string | null } | null;
    user?: { id: number; nombre: string; email: string };
  }) {
    const toNum = (v: unknown) =>
      typeof v === 'object' && v !== null && 'toNumber' in v
        ? (v as { toNumber: () => number }).toNumber()
        : Number(v);

    return {
      ...order,
      total: toNum(order.total),
      items: order.items.map((item) => ({
        ...item,
        subtotal: toNum(item.subtotal),
        product: item.product
          ? { ...item.product, precio: item.product.precio ? toNum(item.product.precio) : undefined }
          : item.product,
      })),
      payment: order.payment
        ? { ...order.payment, monto: toNum(order.payment.monto) }
        : null,
    };
  }
}

export const ordersService = new OrdersService();
