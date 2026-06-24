import { prisma } from '../../database/prisma';
import { paginate } from '../../common/types';

export class InventoryRepository {
  async findAll(page = 1, limit = 20) {
    const { skip, take, page: p, limit: l } = paginate(page, limit);

    const [items, total] = await Promise.all([
      prisma.inventory.findMany({
        skip,
        take,
        include: {
          product: {
            select: { id: true, nombre: true, precio: true, imagen: true },
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.inventory.count(),
    ]);

    return { items, total, page: p, limit: l };
  }

  async findByProductId(productId: number) {
    return prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: { select: { id: true, nombre: true, precio: true } },
      },
    });
  }

  async updateStock(productId: number, stock: number) {
    return prisma.inventory.update({
      where: { productId },
      data: { stock },
      include: {
        product: { select: { id: true, nombre: true } },
      },
    });
  }

  async decrementStock(
    tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
    productId: number,
    cantidad: number
  ) {
    const inventory = await tx.inventory.findUnique({ where: { productId } });
    if (!inventory || inventory.stock < cantidad) {
      throw new Error(`Stock insuficiente para producto ${productId}`);
    }

    return tx.inventory.update({
      where: { productId },
      data: { stock: { decrement: cantidad } },
    });
  }

  async checkStock(productId: number, cantidad: number): Promise<boolean> {
    const inventory = await prisma.inventory.findUnique({ where: { productId } });
    return inventory !== null && inventory.stock >= cantidad;
  }
}

export const inventoryRepository = new InventoryRepository();
