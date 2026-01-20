import { Router } from 'express';
import { authController } from './auth.controller';
import { authGuard } from '../../shared/guards/auth.guard';

const router = Router();

// Login unificado
router.post('/login', authController.login.bind(authController));

// Registro
router.post('/register', authController.register.bind(authController));

// Obtener usuario actual
router.get('/me', authGuard, authController.getCurrentUser.bind(authController));

// Recuperación de contraseña
router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

export default router;
