import { Router } from 'express';
import { Role } from '@prisma/client';
import { categoriesController } from './categories.controller';
import { validate } from '../../common/middleware/validate';
import { createCategorySchema, updateCategorySchema } from './categories.dto';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', categoriesController.getAll.bind(categoriesController));
router.get('/:id', categoriesController.getById.bind(categoriesController));

router.post('/', authenticate, authorize(Role.ADMIN), validate(createCategorySchema), categoriesController.create.bind(categoriesController));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateCategorySchema), categoriesController.update.bind(categoriesController));
router.delete('/:id', authenticate, authorize(Role.ADMIN), categoriesController.delete.bind(categoriesController));

export default router;
