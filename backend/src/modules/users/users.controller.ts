import { Request, Response, NextFunction } from 'express';
import { usersService } from './users.service';

export class UsersController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await usersService.getAll(page, limit);
      res.json({ success: true, data: result.users, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.getById(Number(req.params.id));
      res.json({ success: true, data: user });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.update(Number(req.params.id), req.body, req.user!.userId);
      res.json({ success: true, message: 'Usuario actualizado', data: user });
    } catch (error) {
      next(error);
    }
  }

  async updateRole(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await usersService.updateRole(Number(req.params.id), req.body, req.user!.userId);
      res.json({ success: true, message: 'Rol actualizado', data: user });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await usersService.delete(Number(req.params.id), req.user!.userId);
      res.json({ success: true, message: 'Usuario eliminado' });
    } catch (error) {
      next(error);
    }
  }
}

export const usersController = new UsersController();
