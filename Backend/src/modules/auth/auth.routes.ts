import { Router } from 'express';
import { authController } from './auth.controller';
import { authGuard } from '../../shared/guards/auth.guard';
import { validateDto } from '../../shared/validators/validation.middleware';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { authLimiter, passwordResetLimiter } from '../../app/middlewares/rate-limiter';

const router = Router();

router.post('/login', authLimiter, validateDto(LoginDto), authController.login);

router.post('/register', authLimiter, validateDto(RegisterDto), authController.register);

router.get('/me', authGuard, authController.getCurrentUser);

router.post('/forgot-password', passwordResetLimiter, authController.forgotPassword);

router.post('/reset-password', passwordResetLimiter, authController.resetPassword);

router.post('/refresh', authController.refreshToken);

router.post('/logout', authGuard, authController.logout);

export default router;
