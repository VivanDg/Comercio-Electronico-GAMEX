import { Request, Response, NextFunction } from 'express';
import { categoriesService } from './categories.service';

export class CategoriesController {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoriesService.getAll();
      res.json({ success: true, data: categories });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.getById(Number(req.params.id));
      res.json({ success: true, data: category });
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.create(req.body, req.user!.userId);
      res.status(201).json({ success: true, message: 'Categoría creada', data: category });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoriesService.update(Number(req.params.id), req.body, req.user!.userId);
      res.json({ success: true, message: 'Categoría actualizada', data: category });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await categoriesService.delete(Number(req.params.id), req.user!.userId);
      res.json({ success: true, message: 'Categoría eliminada' });
    } catch (error) {
      next(error);
    }
  }
}

export const categoriesController = new CategoriesController();
