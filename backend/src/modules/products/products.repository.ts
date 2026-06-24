import { Prisma } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { paginate } from '../../common/types';
import { ProductFilterDto } from './products.dto';

export class ProductsRepository {
  async findAll(filters: ProductFilterDto) {
    const { skip, take, page, limit } = paginate(filters.page, filters.limit);

    const where: Prisma.ProductWhereInput = {};

    if (filters.search) {
      where.OR = [
        { nombre: { contains: filters.search, mode: 'insensitive' } },
        { descripcion: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.precio = {};
      if (filters.minPrice !== undefined) where.precio.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.precio.lte = filters.maxPrice;
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [filters.sortBy]: filters.sortOrder,
    };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: { select: { id: true, nombre: true } },
          inventory: { select: { stock: true } },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  }

  async findById(id: number) {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, nombre: true } },
        inventory: { select: { stock: true } },
      },
    });
  }

  async create(data: {
    nombre: string;
    descripcion?: string;
    precio: number;
    imagen?: string;
    categoryId: number;
    stock: number;
  }) {
    const { stock, ...productData } = data;

    return prisma.product.create({
      data: {
        ...productData,
        inventory: { create: { stock } },
      },
      include: {
        category: { select: { id: true, nombre: true } },
        inventory: { select: { stock: true } },
      },
    });
  }

  async update(
    id: number,
    data: {
      nombre?: string;
      descripcion?: string;
      precio?: number;
      imagen?: string;
      categoryId?: number;
    }
  ) {
    return prisma.product.update({
      where: { id },
      data,
      include: {
        category: { select: { id: true, nombre: true } },
        inventory: { select: { stock: true } },
      },
    });
  }

  async delete(id: number) {
    return prisma.product.delete({ where: { id } });
  }
}

export const productsRepository = new ProductsRepository();
