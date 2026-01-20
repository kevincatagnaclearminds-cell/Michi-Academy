import { prisma } from '../../config/prisma';
import { USER_SELECT_FOR_LOGIN, USER_SELECT } from '../../shared/utils/prisma-helpers';

type UserForLogin = {
  id: string;
  email: string;
  password: string;
  level: string;
  grade: number | null;
  account_type: string | null;
};

type UserSafe = {
  id: string;
  email: string;
  level: string;
  grade: number | null;
  account_type: string | null;
  created_at: Date | null;
  updated_at: Date | null;
};

type UserForToken = {
  id: string;
  email: string;
  recovery_token: string | null;
  token_expiration: Date | null;
};

export class AuthRepository {
  async findByEmail(email: string): Promise<UserForLogin | null> {
    return await prisma.users.findUnique({
      where: { email },
      select: USER_SELECT_FOR_LOGIN,
    });
  }

  async create(data: { email: string; password: string; level: string; grade?: number; account_type?: string }): Promise<UserSafe> {
    return await prisma.users.create({ 
      data,
      select: USER_SELECT,
    }) as UserSafe;
  }

  async findById(id: string): Promise<UserSafe | null> {
    return await prisma.users.findUnique({
      where: { id },
      select: USER_SELECT,
    }) as UserSafe | null;
  }

  async updateRecoveryToken(id: string, token: string, expiracion: Date): Promise<UserSafe> {
    return await prisma.users.update({
      where: { id },
      data: {
        recovery_token: token,
        token_expiration: expiracion
      },
      select: USER_SELECT,
    }) as UserSafe;
  }

  async findByToken(token: string): Promise<UserForToken | null> {
    return await prisma.users.findFirst({
      where: { recovery_token: token },
      select: {
        id: true,
        email: true,
        recovery_token: true,
        token_expiration: true,
      },
    }) as UserForToken | null;
  }

  async updatePassword(id: string, hashedPassword: string): Promise<UserSafe> {
    return await prisma.users.update({
      where: { id },
      data: {
        password: hashedPassword,
        recovery_token: null,
        token_expiration: null
      },
      select: USER_SELECT,
    }) as UserSafe;
  }

  async updateRefreshToken(id: string, refreshToken: string, expiresAt: Date) {
    return await prisma.users.update({
      where: { id },
      data: {
        refresh_token: refreshToken,
        refresh_token_expires_at: expiresAt,
      },
      select: USER_SELECT,
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<{ id: string; email: string; refresh_token_expires_at: Date | null } | null> {
    return await prisma.users.findFirst({
      where: { refresh_token: refreshToken },
      select: {
        id: true,
        email: true,
        refresh_token_expires_at: true,
      },
    });
  }

  async revokeRefreshToken(id: string) {
    return await prisma.users.update({
      where: { id },
      data: {
        refresh_token: null,
        refresh_token_expires_at: null,
      },
    });
  }
}

export const authRepository = new AuthRepository();
