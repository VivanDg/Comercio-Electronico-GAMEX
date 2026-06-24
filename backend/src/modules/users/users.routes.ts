import { Router } from 'express';
import { Role } from '@prisma/client';
import { usersController } from './users.controller';
import { validate } from '../../common/middleware/validate';
import { updateUserSchema, updateRoleSchema } from './users.dto';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize(Role.ADMIN));

router.get('/', usersController.getAll.bind(usersController));
router.get('/:id', usersController.getById.bind(usersController));
router.put('/:id', validate(updateUserSchema), usersController.update.bind(usersController));
router.patch('/:id/role', validate(updateRoleSchema), usersController.updateRole.bind(usersController));
router.delete('/:id', usersController.delete.bind(usersController));

export default router;
