import { authRepository } from './auth.repository';
import { hashPassword, comparePassword } from '../../shared/utils/hash';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { AppError } from '../../shared/errors/AppError';

export class AuthService {
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const usuario = await authRepository.findByEmail(email);
    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isPasswordValid = await comparePassword(password, usuario.contrasena);
    if (!isPasswordValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: usuario.id.toString(),
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
      },
      token,
    };
  }

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const existingUser = await authRepository.findByEmail(email);
    if (existingUser) {
      throw new AppError('El email ya está registrado', 400);
    }

    const hashedPassword = await hashPassword(password);

    const usuario = await authRepository.create({
      email,
      contrasena: hashedPassword,
    });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      user: {
        id: usuario.id.toString(),
        email: usuario.email,
        username: usuario.email.split('@')[0],
        name: usuario.email.split('@')[0],
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
    };
  }
}

export const authService = new AuthService();
