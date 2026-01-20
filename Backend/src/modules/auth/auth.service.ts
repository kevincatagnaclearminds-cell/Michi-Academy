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
  private parseExpiresIn(expiresIn: string): number {
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) return 3600;

    const value = parseInt(match[1]);
    const unit = match[2];

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 3600;
      case 'd': return value * 86400;
      default: return 3600;
    }
  }
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await authRepository.findByEmail(email);
    if (!usuario) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await comparePassword(password, usuario.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const expiresIn = env.JWT_EXPIRES_IN || '24h';
    const expiresInSeconds = this.parseExpiresIn(expiresIn);

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: usuario.level },
      String(env.JWT_SECRET),
      { expiresIn: expiresIn as any }
    );

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN || '7d';
    const refreshExpiresInSeconds = this.parseExpiresIn(refreshExpiresIn);
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setSeconds(refreshExpiresAt.getSeconds() + refreshExpiresInSeconds);

    await authRepository.updateRefreshToken(usuario.id, refreshToken, refreshExpiresAt);

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
        level: usuario.level,
        grade: usuario.grade,
        account_type: usuario.account_type,
        active: true
      },
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
      refreshExpiresIn: refreshExpiresInSeconds,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password, level, grade, account_type } = registerDto;

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('Email is already registered', 400);
    }

    const hashedPassword = await hashPassword(password);

    const usuario = await authRepository.create({
      email,
      password: hashedPassword,
      level,
      grade,
      account_type
    });

    const expiresIn = env.JWT_EXPIRES_IN || '24h';
    const expiresInSeconds = this.parseExpiresIn(expiresIn);

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email, nivel: usuario.level },
      String(env.JWT_SECRET),
      { expiresIn: expiresIn as any }
    );

    const refreshToken = crypto.randomBytes(32).toString('hex');
    const refreshExpiresIn = env.JWT_REFRESH_EXPIRES_IN || '7d';
    const refreshExpiresInSeconds = this.parseExpiresIn(refreshExpiresIn);
    const refreshExpiresAt = new Date();
    refreshExpiresAt.setSeconds(refreshExpiresAt.getSeconds() + refreshExpiresInSeconds);

    await authRepository.updateRefreshToken(usuario.id, refreshToken, refreshExpiresAt);

    return {
      user: {
        id: usuario.id,
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
        level: usuario.level,
        grade: usuario.grade,
        account_type: usuario.account_type,
        active: true
      },
      accessToken,
      refreshToken,
      expiresIn: expiresInSeconds,
      refreshExpiresIn: refreshExpiresInSeconds,
    };
  }

  async refreshToken(refreshToken: string) {
    const usuario = await authRepository.findByRefreshToken(refreshToken);

    if (!usuario || !usuario.refresh_token_expires_at || usuario.refresh_token_expires_at < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const expiresIn = env.JWT_EXPIRES_IN || '24h';
    const expiresInSeconds = this.parseExpiresIn(expiresIn);

    const accessToken = jwt.sign(
      { id: usuario.id, email: usuario.email },
      String(env.JWT_SECRET),
      { expiresIn: expiresIn as any }
    );

    return {
      accessToken,
      expiresIn: expiresInSeconds,
    };
  }

  async logout(userId: string) {
    await authRepository.revokeRefreshToken(userId);
    return { message: 'Logged out successfully' };
  }

  async getCurrentUser(userId: string) {
    const usuario = await authRepository.findById(userId);
    if (!usuario) {
      throw new AppError('User not found', 404);
    }

    return {
      id: usuario.id,
      email: usuario.email,
      username: usuario.email.split('@')[0],
      name: usuario.email.split('@')[0],
      level: usuario.level,
      grade: usuario.grade,
      account_type: usuario.account_type,
      active: true
    };
  }

  async solicitarRecuperacion(email: string) {
    const usuario = await authRepository.findByEmail(email);

    if(!usuario) {
      throw new AppError('No user found with that email address', 404);
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiracion = new Date();
    expiracion.setHours(expiracion.getHours() + 1);

    await authRepository.updateRecoveryToken(usuario.id, token, expiracion);

    await sendRecoveryEmail(usuario.email, token, usuario.level);

    return { message: 'Recovery email sent successfully' };
  }

  async resetearPassword(token: string, newPassword: string) {
    const usuario = await authRepository.findByToken(token);

    if(!usuario || !usuario.token_expiration || usuario.token_expiration < new Date()) {
      throw new AppError('Recovery link is invalid or has expired', 404);
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updatePassword(usuario.id, hashedPassword);

    return { message: 'Password updated successfully' }
  }
}

export const authService = new AuthService();
