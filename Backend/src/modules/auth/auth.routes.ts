import { Router } from 'express';
import { authController } from './auth.controller';
import { authGuard } from '../../shared/guards/auth.guard';

const router = Router();

router.post('/login', authController.login.bind(authController));
router.post('/register', authController.register.bind(authController));
router.get('/me', authGuard, authController.getCurrentUser.bind(authController));

export default router;
