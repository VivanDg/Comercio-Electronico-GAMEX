import { Router } from 'express';
import { Role } from '@prisma/client';
import { productsController } from './products.controller';
import { validate } from '../../common/middleware/validate';
import { createProductSchema, updateProductSchema, productFilterSchema } from './products.dto';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', validate(productFilterSchema, 'query'), productsController.getAll.bind(productsController));
router.get('/:id', productsController.getById.bind(productsController));

router.post('/', authenticate, authorize(Role.ADMIN), validate(createProductSchema), productsController.create.bind(productsController));
router.put('/:id', authenticate, authorize(Role.ADMIN), validate(updateProductSchema), productsController.update.bind(productsController));
router.delete('/:id', authenticate, authorize(Role.ADMIN), productsController.delete.bind(productsController));

export default router;
