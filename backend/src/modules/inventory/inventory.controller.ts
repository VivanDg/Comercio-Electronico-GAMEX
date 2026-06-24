import { Request, Response, NextFunction } from 'express';
import { inventoryService } from './inventory.service';

export class InventoryController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 20;
      const result = await inventoryService.getAll(page, limit);
      res.json({ success: true, data: result.items, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }

  async getByProductId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await inventoryService.getByProductId(Number(req.params.productId));
      res.json({ success: true, data: inventory });
    } catch (error) {
      next(error);
    }
  }

  async updateStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await inventoryService.updateStock(
        Number(req.params.productId),
        req.body,
        req.user!.userId
      );
      res.json({ success: true, message: 'Stock actualizado', data: inventory });
    } catch (error) {
      next(error);
    }
  }

  async adjustStock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const inventory = await inventoryService.adjustStock(
        Number(req.params.productId),
        req.body,
        req.user!.userId
      );
      res.json({ success: true, message: 'Stock ajustado', data: inventory });
    } catch (error) {
      next(error);
    }
  }
}

export const inventoryController = new InventoryController();
