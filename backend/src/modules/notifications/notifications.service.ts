import { Resend } from 'resend';
import { env } from '../../config/env';
import { logger } from '../../common/logger';

const resend = new Resend(env.RESEND_API_KEY);

export class NotificationsService {
  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await resend.emails.send({
        from: env.RESEND_FROM_EMAIL,
        to,
        subject,
        html,
      });
      logger.info('Email sent', { to, subject });
    } catch (error) {
      logger.error('Failed to send email', { to, subject, error });
    }
  }

  async sendWelcomeEmail(email: string, nombre: string): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">¡Bienvenido a Gamex Import!</h1>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu cuenta ha sido creada exitosamente. Ya puedes explorar nuestro catálogo de productos tecnológicos.</p>
        <a href="${env.FRONTEND_URL}/catalogo" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Ver Catálogo
        </a>
        <p style="color: #666; margin-top: 24px;">Gamex Import (E.I.R.L.) - Tecnología de calidad</p>
      </div>
    `;
    await this.sendEmail(email, 'Bienvenido a Gamex Import', html);
  }

  async sendPurchaseEmail(
    email: string,
    nombre: string,
    orderId: number,
    total: number,
    items: Array<{ nombre: string; cantidad: number; subtotal: number }>
  ): Promise<void> {
    const itemsHtml = items
      .map(
        (item) =>
          `<tr><td style="padding: 8px; border-bottom: 1px solid #eee;">${item.nombre}</td>
           <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">${item.cantidad}</td>
           <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">S/ ${item.subtotal.toFixed(2)}</td></tr>`
      )
      .join('');

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">¡Compra Confirmada!</h1>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu pedido <strong>#${orderId}</strong> ha sido registrado exitosamente.</p>
        <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
          <thead><tr style="background: #f3f4f6;">
            <th style="padding: 8px; text-align: left;">Producto</th>
            <th style="padding: 8px; text-align: center;">Cant.</th>
            <th style="padding: 8px; text-align: right;">Subtotal</th>
          </tr></thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot><tr>
            <td colspan="2" style="padding: 8px; font-weight: bold;">Total</td>
            <td style="padding: 8px; text-align: right; font-weight: bold;">S/ ${total.toFixed(2)}</td>
          </tr></tfoot>
        </table>
        <a href="${env.FRONTEND_URL}/pedidos/${orderId}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
          Ver Pedido
        </a>
      </div>
    `;
    await this.sendEmail(email, `Pedido #${orderId} confirmado - Gamex Import`, html);
  }

  async sendOrderStatusEmail(
    email: string,
    nombre: string,
    orderId: number,
    newStatus: string
  ): Promise<void> {
    const statusLabels: Record<string, string> = {
      PAGADO: 'Pagado',
      ENVIADO: 'Enviado',
      ENTREGADO: 'Entregado',
      CANCELADO: 'Cancelado',
    };

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2563eb;">Actualización de Pedido</h1>
        <p>Hola <strong>${nombre}</strong>,</p>
        <p>Tu pedido <strong>#${orderId}</strong> ha cambiado de estado a: <strong>${statusLabels[newStatus] || newStatus}</strong></p>
        <a href="${env.FRONTEND_URL}/pedidos/${orderId}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 16px;">
          Ver Detalles
        </a>
      </div>
    `;
    await this.sendEmail(email, `Pedido #${orderId} - Estado: ${statusLabels[newStatus] || newStatus}`, html);
  }
}

export const notificationsService = new NotificationsService();
