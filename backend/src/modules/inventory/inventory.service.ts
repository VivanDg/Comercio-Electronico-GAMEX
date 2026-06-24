import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { buildMeta } from '../../common/types';
import { logOperation } from '../../common/services/operationLog.service';
import { inventoryRepository } from './inventory.repository';
import { UpdateStockDto, AdjustStockDto } from './inventory.dto';

export class InventoryService {
  async getAll(page = 1, limit = 20) {
    const { items, total, page: p, limit: l } = await inventoryRepository.findAll(page, limit);
    return {
      items: items.map((item) => ({
        ...item,
        product: {
          ...item.product,
          precio: Number(item.product.precio),
        },
      })),
      meta: buildMeta(total, p, l),
    };
  }

  async getByProductId(productId: number) {
    const inventory = await inventoryRepository.findByProductId(productId);
    if (!inventory) throw new NotFoundError('Inventario no encontrado para este producto');
    return {
      ...inventory,
      product: {
        ...inventory.product,
        precio: Number(inventory.product.precio),
      },
    };
  }

  async updateStock(productId: number, dto: UpdateStockDto, userId: number) {
    const existing = await inventoryRepository.findByProductId(productId);
    if (!existing) throw new NotFoundError('Producto no encontrado en inventario');

    const updated = await inventoryRepository.updateStock(productId, dto.stock);

    await logOperation({
      action: 'UPDATE_STOCK',
      entity: 'Inventory',
      entityId: updated.id,
      userId,
      details: { productId, previousStock: existing.stock, newStock: dto.stock },
    });

    return updated;
  }

  async adjustStock(productId: number, dto: AdjustStockDto, userId: number) {
    const existing = await inventoryRepository.findByProductId(productId);
    if (!existing) throw new NotFoundError('Producto no encontrado en inventario');

    const newStock = existing.stock + dto.cantidad;
    if (newStock < 0) {
      throw new ValidationError('El stock resultante no puede ser negativo');
    }

    const updated = await inventoryRepository.updateStock(productId, newStock);

    await logOperation({
      action: 'ADJUST_STOCK',
      entity: 'Inventory',
      entityId: updated.id,
      userId,
      details: { productId, adjustment: dto.cantidad, motivo: dto.motivo, newStock },
    });

    return updated;
  }

  async validateStock(items: Array<{ productId: number; cantidad: number }>): Promise<void> {
    for (const item of items) {
      const hasStock = await inventoryRepository.checkStock(item.productId, item.cantidad);
      if (!hasStock) {
        throw new ValidationError(`Stock insuficiente para el producto ID ${item.productId}`);
      }
    }
  }
}

export const inventoryService = new InventoryService();
