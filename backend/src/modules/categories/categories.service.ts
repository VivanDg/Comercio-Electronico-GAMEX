import { NotFoundError, ValidationError } from '../../common/errors/AppError';
import { logOperation } from '../../common/services/operationLog.service';
import { categoriesRepository } from './categories.repository';
import { CreateCategoryDto, UpdateCategoryDto } from './categories.dto';

export class CategoriesService {
  async getAll() {
    return categoriesRepository.findAll();
  }

  async getById(id: number) {
    const category = await categoriesRepository.findById(id);
    if (!category) throw new NotFoundError('Categoría no encontrada');
    return category;
  }

  async create(dto: CreateCategoryDto, userId: number) {
    const category = await categoriesRepository.create(dto);

    await logOperation({
      action: 'CREATE',
      entity: 'Category',
      entityId: category.id,
      userId,
      details: dto,
    });

    return category;
  }

  async update(id: number, dto: UpdateCategoryDto, userId: number) {
    await this.getById(id);
    const category = await categoriesRepository.update(id, dto);

    await logOperation({
      action: 'UPDATE',
      entity: 'Category',
      entityId: id,
      userId,
      details: dto,
    });

    return category;
  }

  async delete(id: number, userId: number) {
    const category = await this.getById(id);
    if (category._count.products > 0) {
      throw new ValidationError('No se puede eliminar una categoría con productos asociados');
    }

    await categoriesRepository.delete(id);

    await logOperation({
      action: 'DELETE',
      entity: 'Category',
      entityId: id,
      userId,
    });
  }
}

export const categoriesService = new CategoriesService();
