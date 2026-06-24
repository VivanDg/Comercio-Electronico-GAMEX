import { Router } from 'express';
import { Role } from '@prisma/client';
import { inventoryController } from './inventory.controller';
import { validate } from '../../common/middleware/validate';
import { updateStockSchema, adjustStockSchema } from './inventory.dto';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize(Role.ADMIN));

router.get('/', inventoryController.getAll.bind(inventoryController));
router.get('/:productId', inventoryController.getByProductId.bind(inventoryController));
router.put('/:productId', validate(updateStockSchema), inventoryController.updateStock.bind(inventoryController));
router.patch('/:productId/adjust', validate(adjustStockSchema), inventoryController.adjustStock.bind(inventoryController));

export default router;
