import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();
const controller = new AuthController();

router.post('/login', authLimiter, controller.login.bind(controller));
router.post('/register', controller.register.bind(controller));
router.post('/logout', authenticate, controller.logout.bind(controller));
router.get('/me', authenticate, controller.me.bind(controller));

export default router;
