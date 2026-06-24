import { Request, Response, NextFunction } from 'express';
import { logger } from '../../common/logger';
import { paymentsService } from './payments.service';

export class PaymentsController {
  async createPreference(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await paymentsService.createPreference(
        Number(req.body.orderId),
        req.user!.userId
      );
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  }

  async handleWebhook(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = req.body;
      const queryData = req.query;

      const webhookPayload = {
        type: data.type || (queryData.type as string),
        data: data.data || { id: queryData['data.id'] || queryData.id },
        action: data.action,
        id: data.id || queryData.id,
      };

      await paymentsService.handleWebhook(webhookPayload);
      res.status(200).send('OK');
    } catch (error) {
      logger.error('Webhook error', { error });
      res.status(200).send('OK');
    }
  }

  async getStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user!.rol === 'ADMIN';
      const status = await paymentsService.getPaymentStatus(
        Number(req.params.orderId),
        req.user!.userId,
        isAdmin
      );
      res.json({ success: true, data: status });
    } catch (error) {
      next(error);
    }
  }
}

export const paymentsController = new PaymentsController();
