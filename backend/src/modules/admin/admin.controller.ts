import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';

export class AdminController {
  async getDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dashboard = await adminService.getDashboard();
      res.json({ success: true, data: dashboard });
    } catch (error) {
      next(error);
    }
  }

  async getLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 50;
      const result = await adminService.getLogs(page, limit);
      res.json({ success: true, data: result.logs, meta: result.meta });
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
