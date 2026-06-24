import { Role } from '@prisma/client';
import { prisma } from '../../database/prisma';
import { paginate } from '../../common/types';

export class UsersRepository {
  async findAll(page = 1, limit = 10) {
    const { skip, take, page: p, limit: l } = paginate(page, limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take,
        select: {
          id: true,
          nombre: true,
          email: true,
          rol: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { users, total, page: p, limit: l };
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: number, data: { nombre?: string; email?: string; rol?: Role }) {
    return prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        createdAt: true,
      },
    });
  }

  async delete(id: number) {
    return prisma.user.delete({ where: { id } });
  }
}

export const usersRepository = new UsersRepository();
