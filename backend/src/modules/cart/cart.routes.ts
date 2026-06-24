import { Router } from 'express';
import { cartController } from './cart.controller';
import { validate } from '../../common/middleware/validate';
import { addToCartSchema, updateCartItemSchema } from './cart.dto';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', cartController.getCart.bind(cartController));
router.post('/items', validate(addToCartSchema), cartController.addItem.bind(cartController));
router.put('/items/:productId', validate(updateCartItemSchema), cartController.updateItem.bind(cartController));
router.delete('/items/:productId', cartController.removeItem.bind(cartController));
router.delete('/', cartController.clearCart.bind(cartController));

export default router;
