import { OrderStatus, Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { paginate } from '../../common/types';

export class OrdersRepository {
  async findAll(filters: { userId?: number; estado?: OrderStatus; page?: number; limit?: number }) {
    const { skip, take, page, limit } = paginate(filters.page, filters.limit);

    const where: Prisma.OrderWhereInput = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.estado) where.estado = filters.estado;

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take,
        include: {
          items: {
            include: {
              product: { select: { id: true, nombre: true, imagen: true, precio: true } },
            },
          },
          payment: true,
          user: { select: { id: true, nombre: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  }

  async findById(id: number) {
    return prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: { select: { id: true, nombre: true, imagen: true, precio: true } },
          },
        },
        payment: true,
        user: { select: { id: true, nombre: true, email: true } },
      },
    });
  }

  async findByIdAndUserId(id: number, userId: number) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            product: { select: { id: true, nombre: true, imagen: true, precio: true } },
          },
        },
        payment: true,
      },
    });
  }

  async createFromCart(
    userId: number,
    cartItems: Array<{ productId: number; cantidad: number; precio: number }>
  ) {
    const total = cartItems.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

    return prisma.order.create({
      data: {
        userId,
        total,
        estado: OrderStatus.PENDIENTE,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            cantidad: item.cantidad,
            subtotal: item.precio * item.cantidad,
          })),
        },
        payment: {
          create: {
            monto: total,
            estado: 'PENDING',
            metodo: 'MERCADOPAGO',
          },
        },
      },
      include: {
        items: {
          include: {
            product: { select: { id: true, nombre: true, imagen: true } },
          },
        },
        payment: true,
        user: { select: { id: true, nombre: true, email: true } },
      },
    });
  }

  async updateStatus(id: number, estado: OrderStatus) {
    return prisma.order.update({
      where: { id },
      data: { estado },
      include: {
        items: {
          include: {
            product: { select: { id: true, nombre: true } },
          },
        },
        user: { select: { id: true, nombre: true, email: true } },
      },
    });
  }
}

export const ordersRepository = new OrdersRepository();
