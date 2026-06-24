import { Router } from 'express';
import { Role } from '@prisma/client';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate, authorize(Role.ADMIN));

router.get('/dashboard', adminController.getDashboard.bind(adminController));
router.get('/logs', adminController.getLogs.bind(adminController));

export default router;
