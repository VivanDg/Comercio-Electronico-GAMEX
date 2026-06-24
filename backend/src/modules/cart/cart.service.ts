import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { cartRepository } from './cart.repository';
import { AddToCartDto, UpdateCartItemDto } from './cart.dto';
import { prisma } from '../../database/prisma';

export class CartService {
  async getCart(userId: number) {
    const cart = await cartRepository.findOrCreateByUserId(userId);
    return this.formatCart(cart);
  }

  async addItem(userId: number, dto: AddToCartDto) {
    const product = await prisma.product.findUnique({
      where: { id: dto.productId },
      include: { inventory: true },
    });

    if (!product) throw new NotFoundError('Producto no encontrado');
    if (!product.inventory || product.inventory.stock === 0) {
      throw new ValidationError('Producto sin stock disponible');
    }

    const cart = await cartRepository.findOrCreateByUserId(userId);
    const existingItem = cart.items.find((i) => i.productId === dto.productId);
    const currentQty = existingItem?.cantidad ?? 0;

    if (currentQty + dto.cantidad > product.inventory.stock) {
      throw new ValidationError(`Stock insuficiente. Disponible: ${product.inventory.stock}`);
    }

    await cartRepository.addItem(cart.id, dto.productId, dto.cantidad);
    return this.getCart(userId);
  }

  async updateItem(userId: number, productId: number, dto: UpdateCartItemDto) {
    const cart = await cartRepository.findOrCreateByUserId(userId);
    const item = cart.items.find((i) => i.productId === productId);

    if (!item) throw new NotFoundError('Producto no encontrado en el carrito');

    const stock = item.product.inventory?.stock ?? 0;
    if (dto.cantidad > stock) {
      throw new ValidationError(`Stock insuficiente. Disponible: ${stock}`);
    }

    await cartRepository.updateItem(cart.id, productId, dto.cantidad);
    return this.getCart(userId);
  }

  async removeItem(userId: number, productId: number) {
    const cart = await cartRepository.findOrCreateByUserId(userId);
    const item = cart.items.find((i) => i.productId === productId);

    if (!item) throw new NotFoundError('Producto no encontrado en el carrito');

    await cartRepository.removeItem(cart.id, productId);
    return this.getCart(userId);
  }

  async clearCart(userId: number) {
    const cart = await cartRepository.findOrCreateByUserId(userId);
    await cartRepository.clearCart(cart.id);
    return this.getCart(userId);
  }

  private formatCart(cart: Awaited<ReturnType<typeof cartRepository.findOrCreateByUserId>>) {
    const items = cart.items.map((item) => {
      const precio = Number(item.product.precio);
      return {
        id: item.id,
        productId: item.productId,
        cantidad: item.cantidad,
        product: {
          id: item.product.id,
          nombre: item.product.nombre,
          precio,
          imagen: item.product.imagen,
          stock: item.product.inventory?.stock ?? 0,
          category: item.product.category,
        },
        subtotal: precio * item.cantidad,
      };
    });

    const total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.cantidad, 0);

    return { id: cart.id, items, total, itemCount };
  }
}

export const cartService = new CartService();
