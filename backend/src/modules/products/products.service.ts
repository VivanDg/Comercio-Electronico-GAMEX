import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { buildMeta } from '../../common/types';
import { logOperation } from '../../common/services/operationLog.service';
import { productsRepository } from './products.repository';
import { CreateProductDto, UpdateProductDto, ProductFilterDto } from './products.dto';
import { prisma } from '../../database/prisma';

export class ProductsService {
  async getAll(filters: ProductFilterDto) {
    const { products, total, page, limit } = await productsRepository.findAll(filters);
    return {
      products: products.map(this.formatProduct),
      meta: buildMeta(total, page, limit),
    };
  }

  async getById(id: number) {
    const product = await productsRepository.findById(id);
    if (!product) throw new NotFoundError('Producto no encontrado');
    return this.formatProduct(product);
  }

  async create(dto: CreateProductDto, userId: number) {
    const category = await prisma.category.findUnique({ where: { id: dto.categoryId } });
    if (!category) throw new ValidationError('Categoría no válida');

    const product = await productsRepository.create(dto);

    await logOperation({
      action: 'CREATE',
      entity: 'Product',
      entityId: product.id,
      userId,
      details: { nombre: dto.nombre, precio: dto.precio },
    });

    return this.formatProduct(product);
  }

  async update(id: number, dto: UpdateProductDto, userId: number) {
    await this.getById(id);

    if (dto.categoryId) {
      const category = await prisma.category.findUnique({ where: { id: dto.categoryId } });
      if (!category) throw new ValidationError('Categoría no válida');
    }

    if (dto.precio !== undefined && dto.precio <= 0) {
      throw new ValidationError('El precio debe ser mayor a 0');
    }

    const product = await productsRepository.update(id, dto);

    await logOperation({
      action: 'UPDATE',
      entity: 'Product',
      entityId: id,
      userId,
      details: dto,
    });

    return this.formatProduct(product);
  }

  async delete(id: number, userId: number) {
    await this.getById(id);
    await productsRepository.delete(id);

    await logOperation({
      action: 'DELETE',
      entity: 'Product',
      entityId: id,
      userId,
    });
  }

  private formatProduct(product: {
    id: number;
    nombre: string;
    descripcion: string | null;
    precio: { toNumber?: () => number } | number | string;
    imagen: string | null;
    categoryId: number;
    category: { id: number; nombre: string };
    inventory: { stock: number } | null;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    const precio = typeof product.precio === 'object' && product.precio !== null && 'toNumber' in product.precio
      ? (product.precio as { toNumber: () => number }).toNumber()
      : Number(product.precio);

    return {
      ...product,
      precio,
      stock: product.inventory?.stock ?? 0,
      disponible: (product.inventory?.stock ?? 0) > 0,
    };
  }
}

export const productsService = new ProductsService();
