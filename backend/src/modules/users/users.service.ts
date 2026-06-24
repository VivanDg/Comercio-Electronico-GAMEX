import { NotFoundError } from '../../common/errors/AppError';
import { buildMeta } from '../../common/types';
import { logOperation } from '../../common/services/operationLog.service';
import { usersRepository } from './users.repository';
import { UpdateUserDto, UpdateRoleDto } from './users.dto';

export class UsersService {
  async getAll(page = 1, limit = 10) {
    const { users, total, page: p, limit: l } = await usersRepository.findAll(page, limit);
    return { users, meta: buildMeta(total, p, l) };
  }

  async getById(id: number) {
    const user = await usersRepository.findById(id);
    if (!user) throw new NotFoundError('Usuario no encontrado');
    return user;
  }

  async update(id: number, dto: UpdateUserDto, adminId: number) {
    const user = await usersRepository.update(id, dto);

    await logOperation({
      action: 'UPDATE',
      entity: 'User',
      entityId: id,
      userId: adminId,
      details: dto,
    });

    return user;
  }

  async updateRole(id: number, dto: UpdateRoleDto, adminId: number) {
    const user = await usersRepository.update(id, { rol: dto.rol });

    await logOperation({
      action: 'UPDATE_ROLE',
      entity: 'User',
      entityId: id,
      userId: adminId,
      details: { rol: dto.rol },
    });

    return user;
  }

  async delete(id: number, adminId: number) {
    await usersRepository.delete(id);

    await logOperation({
      action: 'DELETE',
      entity: 'User',
      entityId: id,
      userId: adminId,
    });
  }
}

export const usersService = new UsersService();
