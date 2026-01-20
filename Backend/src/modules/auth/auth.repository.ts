import { prisma } from '../../config/prisma';
import { Users } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string): Promise<Users | null> {
    return await prisma.users.findUnique({
      where: { email }
    });
  }

  async create(data: { email: string; password: string; level: string; grade?: number; account_type?: string }): Promise<Users> {
    return await prisma.users.create({ data });
  }

  async findById(id: number): Promise<Users | null> {
    return await prisma.users.findUnique({
      where: { id }
    });
  }

  async updateRecoveryToken(id: number, token: string, expiracion: Date) {
    return await prisma.users.update({
      where: { id },
      data: {
        recovery_token: token,
        token_expiration: expiracion
      }
    });
  }

  async findByToken(token: string): Promise<Users | null> {
    return await prisma.users.findFirst({
      where: { recovery_token: token }
    });
  }

  async updatePassword(id: number, hashedPassword: string) {
    return await prisma.users.update({
      where: { id },
      data: {
        password: hashedPassword,
        recovery_token: null,
        token_expiration: null
      }
    });
  }
}

export const authRepository = new AuthRepository();
