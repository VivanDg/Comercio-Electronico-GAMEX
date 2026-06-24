import { Request, Response, NextFunction } from 'express';
import { OrderStatus } from '@prisma/client';
import { ordersService } from './orders.service';

export class OrdersController {
  async createFromCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.createFromCart(req.user!.userId);
      res.status(201).json({ success: true, message: 'Pedido creado', data: order });
    } catch (error) {
      next(error);
    }
  }

  async getMyOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await ordersService.getMyOrders(req.user!.userId, page, limit);
      res.json({ success: true, data: result.orders, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const estado = req.query.estado as OrderStatus | undefined;
      const result = await ordersService.getAll(page, limit, estado);
      res.json({ success: true, data: result.orders, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const isAdmin = req.user!.rol === 'ADMIN';
      const order = await ordersService.getById(
        Number(req.params.id),
        req.user!.userId,
        isAdmin
      );
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const order = await ordersService.updateStatus(
        Number(req.params.id),
        req.body,
        req.user!.userId
      );
      res.json({ success: true, message: 'Estado actualizado', data: order });
    } catch (error) {
      next(error);
    }
  }
}

export const ordersController = new OrdersController();
