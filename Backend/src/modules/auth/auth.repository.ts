import prisma from '../../config/prisma';
import { Usuario } from '@prisma/client';

export class AuthRepository {
  async findByEmail(email: string): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { email },
    });
  }

  async create(data: { email: string; contrasena: string; tipo_cuenta?: string }): Promise<Usuario> {
    return prisma.usuario.create({
      data,
    });
  }

  async findById(id: number): Promise<Usuario | null> {
    return prisma.usuario.findUnique({
      where: { id },
    });
  }
}

export const authRepository = new AuthRepository();
