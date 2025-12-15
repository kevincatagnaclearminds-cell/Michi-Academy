import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthRequest } from '../../shared/guards/auth.guard';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const loginDto: LoginDto = req.body;
      const result = await authService.login(loginDto);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error al iniciar sesión',
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const registerDto: RegisterDto = req.body;
      const result = await authService.register(registerDto);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error al registrar usuario',
      });
    }
  }

  async getCurrentUser(req: AuthRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Usuario no autenticado' });
      }
      const user = await authService.getCurrentUser(req.user.id);
      res.json({ user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error al obtener usuario',
      });
    }
  }
}

export const authController = new AuthController();
