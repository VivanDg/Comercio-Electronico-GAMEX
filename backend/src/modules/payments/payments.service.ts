import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago';
import { OrderStatus, PaymentStatus } from '@prisma/client';
import { env } from '../../config/env';
import { NotFoundError, ValidationError, ForbiddenError } from '../../common/errors/AppError';
import { logOperation } from '../../common/services/operationLog.service';
import { logger } from '../../common/logger';
import { prisma } from '../../database/prisma';
import { paymentsRepository } from './payments.repository';
import { inventoryRepository } from '../inventory/inventory.repository';
import { notificationsService } from '../notifications/notifications.service';
import { ordersService } from '../orders/orders.service';

const client = new MercadoPagoConfig({ accessToken: env.MERCADOPAGO_ACCESS_TOKEN });
const preferenceClient = new Preference(client);
const paymentClient = new MPPayment(client);

export class PaymentsService {
  async createPreference(orderId: number, userId: number) {
    await ordersService.validateOrderAccess(orderId, userId, false);

    const payment = await paymentsRepository.findByOrderId(orderId);
    if (!payment) throw new NotFoundError('Pago no encontrado');

    if (payment.order.estado !== OrderStatus.PENDIENTE) {
      throw new ValidationError('El pedido no está pendiente de pago');
    }

    if (payment.estado === PaymentStatus.APPROVED) {
      throw new ValidationError('El pedido ya fue pagado');
    }

    const items = payment.order.items.map((item) => ({
      id: String(item.productId),
      title: item.product.nombre,
      quantity: item.cantidad,
      unit_price: Number(item.product.precio),
      currency_id: 'PEN',
    }));

    const preference = await preferenceClient.create({
      body: {
        items,
        payer: {
          email: payment.order.user.email,
          name: payment.order.user.nombre,
        },
        back_urls: {
          success: `${env.FRONTEND_URL}/checkout/success?orderId=${orderId}`,
          failure: `${env.FRONTEND_URL}/checkout/failure?orderId=${orderId}`,
          pending: `${env.FRONTEND_URL}/checkout/pending?orderId=${orderId}`,
        },
        auto_return: 'approved',
        external_reference: String(orderId),
        notification_url: env.MERCADOPAGO_NOTIFICATION_URL,
        metadata: { order_id: orderId, user_id: userId },
      },
    });

    await paymentsRepository.updatePreference(orderId, preference.id!);

    await logOperation({
      action: 'CREATE_PREFERENCE',
      entity: 'Payment',
      entityId: payment.id,
      userId,
      details: { orderId, preferenceId: preference.id },
    });

    return {
      preferenceId: preference.id,
      initPoint: preference.init_point,
      sandboxInitPoint: preference.sandbox_init_point,
    };
  }

  async handleWebhook(data: { type?: string; data?: { id?: string }; action?: string; id?: string }) {
    logger.info('Webhook received', { data });

    const paymentId = data.data?.id || data.id;
    if (!paymentId) {
      logger.warn('Webhook without payment ID');
      return;
    }

    try {
      const mpPayment = await paymentClient.get({ id: String(paymentId) });
      const externalReference = mpPayment.external_reference;

      if (!externalReference) {
        logger.warn('Payment without external reference', { paymentId });
        return;
      }

      const orderId = parseInt(externalReference, 10);
      const payment = await paymentsRepository.findByOrderId(orderId);

      if (!payment) {
        logger.warn('Payment record not found', { orderId });
        return;
      }

      const mpStatus = mpPayment.status;
      let paymentStatus: PaymentStatus;
      let orderStatus: OrderStatus | null = null;

      switch (mpStatus) {
        case 'approved':
          paymentStatus = PaymentStatus.APPROVED;
          orderStatus = OrderStatus.PAGADO;
          break;
        case 'rejected':
          paymentStatus = PaymentStatus.REJECTED;
          break;
        case 'cancelled':
          paymentStatus = PaymentStatus.CANCELLED;
          orderStatus = OrderStatus.CANCELADO;
          break;
        case 'refunded':
          paymentStatus = PaymentStatus.REFUNDED;
          break;
        default:
          paymentStatus = PaymentStatus.PENDING;
      }

      if (payment.estado === PaymentStatus.APPROVED && paymentStatus === PaymentStatus.APPROVED) {
        logger.info('Payment already processed', { orderId });
        return;
      }

      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { orderId },
          data: {
            estado: paymentStatus,
            mercadoPagoId: String(paymentId),
            externalReference: externalReference,
          },
        });

        if (orderStatus) {
          await tx.order.update({
            where: { id: orderId },
            data: { estado: orderStatus },
          });
        }

        if (paymentStatus === PaymentStatus.APPROVED) {
          const orderItems = await tx.orderItem.findMany({ where: { orderId } });
          for (const item of orderItems) {
            await inventoryRepository.decrementStock(tx, item.productId, item.cantidad);
          }
        }
      });

      await logOperation({
        action: 'WEBHOOK_PAYMENT',
        entity: 'Payment',
        entityId: payment.id,
        details: { orderId, mpStatus, paymentStatus },
      });

      if (paymentStatus === PaymentStatus.APPROVED) {
        const updatedPayment = await paymentsRepository.findByOrderId(orderId);
        if (updatedPayment) {
          notificationsService
            .sendPurchaseEmail(
              updatedPayment.order.user.email,
              updatedPayment.order.user.nombre,
              orderId,
              Number(updatedPayment.order.total),
              updatedPayment.order.items.map((item) => ({
                nombre: item.product.nombre,
                cantidad: item.cantidad,
                subtotal: Number(item.subtotal),
              }))
            )
            .catch(() => {});
        }
      }

      logger.info('Webhook processed', { orderId, paymentStatus });
    } catch (error) {
      logger.error('Webhook processing error', { error, paymentId });
      throw error;
    }
  }

  async getPaymentStatus(orderId: number, userId: number, isAdmin: boolean) {
    await ordersService.validateOrderAccess(orderId, userId, isAdmin);

    const payment = await paymentsRepository.findByOrderId(orderId);
    if (!payment) throw new NotFoundError('Pago no encontrado');

    return {
      orderId: payment.orderId,
      estado: payment.estado,
      monto: Number(payment.monto),
      metodo: payment.metodo,
      orderStatus: payment.order.estado,
    };
  }
}

export const paymentsService = new PaymentsService();
