import { authRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../shared/utils/hash';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';
import crypto from 'crypto';

import { sendRecoveryEmail } from '../../shared/utils/mailer';

export class AuthService {
  async login(loginDto: LoginDto, nivel: 'primaria' | 'secundaria') {
    const { email, password } = loginDto;

    const usuario = await authRepository.findByEmail(email, nivel);
    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isPasswordValid = await comparePassword(password, usuario.contrasena);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: nivel },
      String(env.JWT_SECRET),
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: usuario.id.toString(),
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
        nivel
      },
      token,
    };
  }

  async register(registerDto: RegisterDto, nivel: 'primaria' | 'secundaria') {
    const { email, password } = registerDto;

    const existingUser = await authRepository.findByEmail(email, nivel);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const hashedPassword = await hashPassword(password);

    const usuario = await authRepository.create({
      email,
      contrasena: hashedPassword,
    }, nivel);

    if(!usuario) {
      throw new AppError('Error al crear el usuario', 500);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: nivel },
      String(env.JWT_SECRET),
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: usuario.id.toString(),
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
        nivel
      },
      token,
    };
  }

  async getCurrentUser(userId: number, nivel: 'primaria' | 'secundaria') {
    const usuario = await authRepository.findById(userId, nivel);
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return {
      id: usuario.id.toString(),
      email: usuario.email,
      username: usuario.email.split('@')[0],
      name: usuario.email.split('@')[0],
      nivel
    };
  }

  async solicitarRecuperacion(email: string, nivel: 'primaria' | 'secundaria') {
    const usuario = await authRepository.findByEmail(email, nivel);

    if(!usuario) {
      throw new AppError('No existe un usuario con ese correo electronico', 404);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    await authRepository.updateRecoveryToken(usuario.id, token, expiracion, nivel);

    await sendRecoveryEmail(usuario.email, token, nivel);

    return { message: 'Correo enviado correctamente' };
  }

  async resetearPassword(token: string, newPassword: string, nivel: 'primaria' | 'secundaria') {
    const usuario = await authRepository.findByToken(token, nivel);

    if(!usuario || !usuario.expiracion_token || usuario.expiracion_token < new Date()) {
      throw new AppError('El enlace de recuperación  es inválido o ha expirado', 404);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(usuario.id, hashedPassword, nivel);

    return { message: 'Constraseña actualizada correctamente' }
  }
}

export const authService = new AuthService();
