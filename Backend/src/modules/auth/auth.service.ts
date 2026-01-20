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
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await authRepository.findByEmail(email);
    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isPasswordValid = await comparePassword(password, usuario.password);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: usuario.level },
      String(env.JWT_SECRET),
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: usuario.id.toString(),
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
        level: usuario.level
      },
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, level, grade, account_type } = registerDto;

    if (!level) {
      throw new AppError('El nivel educativo es requerido', 400);
    }

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const hashedPassword = await hashPassword(password);

    const usuario = await authRepository.create({
      email,
      password: hashedPassword,
      level,
      grade,
      account_type
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: usuario.level },
      String(env.JWT_SECRET),
      { expiresIn: env.JWT_EXPIRES_IN as any }
    );

    return {
      user: {
        id: usuario.id.toString(),
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
        level: usuario.level
      },
      token,
    };
  }

  async getCurrentUser(userId: number) {
    const usuario = await authRepository.findById(userId);
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return {
      id: usuario.id.toString(),
      email: usuario.email,
      username: usuario.email.split('@')[0],
      name: usuario.email.split('@')[0],
      level: usuario.level
    };
  }

  async solicitarRecuperacion(email: string) {
    const usuario = await authRepository.findByEmail(email);

    if(!usuario) {
      throw new AppError('No existe un usuario con ese correo electronico', 404);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    await authRepository.updateRecoveryToken(usuario.id, token, expiracion);

    await sendRecoveryEmail(usuario.email, token, usuario.level);

    return { message: 'Correo enviado correctamente' };
  }

  async resetearPassword(token: string, newPassword: string) {
    const usuario = await authRepository.findByToken(token);

    if(!usuario || !usuario.token_expiration || usuario.token_expiration < new Date()) {
      throw new AppError('El enlace de recuperación es inválido o ha expirado', 404);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(usuario.id, hashedPassword);

    return { message: 'Contraseña actualizada correctamente' }
  }
}

export const authService = new AuthService();
