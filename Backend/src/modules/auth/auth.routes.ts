import { Router } from 'express';
import { authController } from './auth.controller';
import { authGuard } from '../../shared/guards/auth.guard';

const router = Router();

// Login específico para el sistema de Primaria
router.post('/login/primaria', (req, res) => {
  req.body.nivel = 'primaria';
  authController.login.bind(authController)(req, res);
});

// Login específico para el sistema de Secundaria
router.post('/login/secundaria', (req, res) => {
  req.body.nivel = 'secundaria';
  authController.login.bind(authController)(req, res);
});

router.post('/register', authController.register.bind(authController));
router.get('/me', authGuard, authController.getCurrentUser.bind(authController));

router.post('/forgot-password', authController.forgotPassword.bind(authController));
router.post('/reset-password', authController.resetPassword.bind(authController));

export default router;
