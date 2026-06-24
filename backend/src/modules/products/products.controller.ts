import { Request, Response, NextFunction } from 'express';
import { productsService } from './products.service';

export class ProductsController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await productsService.getAll(req.query as never);
      res.json({ success: true, data: result.products, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.getById(Number(req.params.id));
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.create(req.body, req.user!.userId);
      res.status(201).json({ success: true, message: 'Producto creado', data: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const product = await productsService.update(Number(req.params.id), req.body, req.user!.userId);
      res.json({ success: true, message: 'Producto actualizado', data: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await productsService.delete(Number(req.params.id), req.user!.userId);
      res.json({ success: true, message: 'Producto eliminado' });
    } catch (error) {
      next(error);
    }
  }
}

export const productsController = new ProductsController();
