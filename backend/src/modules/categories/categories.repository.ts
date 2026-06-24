import { prisma } from '../../database/prisma';

export class CategoriesRepository {
  async findAll() {
    return prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { nombre: 'asc' },
    });
  }

  async findById(id: number) {
    return prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
  }

  async create(data: { nombre: string; descripcion?: string }) {
    return prisma.category.create({ data });
  }

  async update(id: number, data: { nombre?: string; descripcion?: string }) {
    return prisma.category.update({ where: { id }, data });
  }

  async delete(id: number) {
    return prisma.category.delete({ where: { id } });
  }
}

export const categoriesRepository = new CategoriesRepository();
