import { Request, Response } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { AuthRequest } from '../../shared/guards/auth.guard';

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const { nivel } = req.body;
      const { email, password} = req.body;

      if(!email || !password) {
        return res.status(400).json({
          message: 'Email y constraseña son requeridos'
        });
      }

      const loginDto: LoginDto = { email, password };

      const result = await authService.login(loginDto, nivel);
      res.json(result);
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error al iniciar sesión',
      });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const { nivel } = req.body;
      const registerDto: RegisterDto = req.body;

      const result = await authService.register(registerDto, nivel);
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

      const user = await authService.getCurrentUser(req.user.id, req.user.nivel);
      res.json({ user });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({
        message: error.message || 'Error al obtener usuario',
      });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email, nivel } = req.body;
      await authService.solicitarRecuperacion(email, nivel);

      res.json({ message: 'Si el correo existe, se ha enviado un enlace de recuperación' });
    } catch (error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword, nivel } = req.body;
      const result = await authService.resetearPassword(token, newPassword, nivel);

      res.json(result);
    } catch(error: any) {
      res.status(error.statusCode || 500).json({ message: error.message });
    }
  }
}

export const authController = new AuthController();
