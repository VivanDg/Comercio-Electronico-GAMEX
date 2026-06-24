import { Router } from 'express';
import { Role } from '@prisma/client';
import { ordersController } from './orders.controller';
import { validate } from '../../common/middleware/validate';
import { updateOrderStatusSchema } from './orders.dto';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/', ordersController.createFromCart.bind(ordersController));
router.get('/my', ordersController.getMyOrders.bind(ordersController));
router.get('/:id', ordersController.getById.bind(ordersController));

router.get('/', authorize(Role.ADMIN), ordersController.getAll.bind(ordersController));
router.patch('/:id/status', authorize(Role.ADMIN), validate(updateOrderStatusSchema), ordersController.updateStatus.bind(ordersController));

export default router;
