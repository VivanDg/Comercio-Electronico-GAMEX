import { PaymentStatus } from '@prisma/client';
import { prisma } from '../../database/prisma';

export class PaymentsRepository {
  async findByOrderId(orderId: number) {
    return prisma.payment.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            items: { include: { product: true } },
            user: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
    });
  }

  async findByMercadoPagoId(mercadoPagoId: string) {
    return prisma.payment.findFirst({
      where: { mercadoPagoId },
      include: {
        order: {
          include: {
            items: true,
            user: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
    });
  }

  async updatePayment(
    orderId: number,
    data: {
      estado: PaymentStatus;
      mercadoPagoId?: string;
      preferenceId?: string;
      externalReference?: string;
    }
  ) {
    return prisma.payment.update({
      where: { orderId },
      data,
      include: {
        order: {
          include: {
            items: { include: { product: true } },
            user: { select: { id: true, nombre: true, email: true } },
          },
        },
      },
    });
  }

  async updatePreference(orderId: number, preferenceId: string) {
    return prisma.payment.update({
      where: { orderId },
      data: { preferenceId },
    });
  }
}

export const paymentsRepository = new PaymentsRepository();
