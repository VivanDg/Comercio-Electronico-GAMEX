import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { validate } from '../../common/middleware/validate';
import { createPaymentSchema } from './payments.dto';
import { authenticate } from '../../middlewares/auth.middleware';
import { paymentRateLimiter } from '../../middlewares/security.middleware';

const router = Router();

router.post('/webhook', paymentsController.handleWebhook.bind(paymentsController));

router.use(authenticate);

router.post('/preference', paymentRateLimiter, validate(createPaymentSchema), paymentsController.createPreference.bind(paymentsController));
router.get('/:orderId/status', paymentsController.getStatus.bind(paymentsController));

export default router;
