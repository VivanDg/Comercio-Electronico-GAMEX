import { Request, Response, NextFunction } from 'express';
import { cartService } from './cart.service';

export class CartController {
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.getCart(req.user!.userId);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  }

  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.addItem(req.user!.userId, req.body);
      res.json({ success: true, message: 'Producto agregado al carrito', data: cart });
    } catch (error) {
      next(error);
    }
  }

  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.updateItem(req.user!.userId, Number(req.params.productId), req.body);
      res.json({ success: true, message: 'Cantidad actualizada', data: cart });
    } catch (error) {
      next(error);
    }
  }

  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.removeItem(req.user!.userId, Number(req.params.productId));
      res.json({ success: true, message: 'Producto eliminado del carrito', data: cart });
    } catch (error) {
      next(error);
    }
  }

  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const cart = await cartService.clearCart(req.user!.userId);
      res.json({ success: true, message: 'Carrito vaciado', data: cart });
    } catch (error) {
      next(error);
    }
  }
}

export const cartController = new CartController();
