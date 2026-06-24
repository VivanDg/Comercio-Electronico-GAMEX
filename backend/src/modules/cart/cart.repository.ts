import { prisma } from '../../database/prisma';

export class CartRepository {
  async findOrCreateByUserId(userId: number) {
    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              include: {
                inventory: { select: { stock: true } },
                category: { select: { id: true, nombre: true } },
              },
            },
          },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  inventory: { select: { stock: true } },
                  category: { select: { id: true, nombre: true } },
                },
              },
            },
          },
        },
      });
    }

    return cart;
  }

  async addItem(cartId: number, productId: number, cantidad: number) {
    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId, productId } },
    });

    if (existing) {
      return prisma.cartItem.update({
        where: { id: existing.id },
        data: { cantidad: existing.cantidad + cantidad },
        include: { product: { include: { inventory: true } } },
      });
    }

    return prisma.cartItem.create({
      data: { cartId, productId, cantidad },
      include: { product: { include: { inventory: true } } },
    });
  }

  async updateItem(cartId: number, productId: number, cantidad: number) {
    return prisma.cartItem.update({
      where: { cartId_productId: { cartId, productId } },
      data: { cantidad },
      include: { product: { include: { inventory: true } } },
    });
  }

  async removeItem(cartId: number, productId: number) {
    return prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  async clearCart(cartId: number) {
    return prisma.cartItem.deleteMany({ where: { cartId } });
  }
}

export const cartRepository = new CartRepository();
