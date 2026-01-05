import { prisma } from '../../config/prisma';
import { UsuariosPrimaria, UsuariosSecundaria } from '@prisma/client';

interface UserTable {
  findUnique: Function;
  create: Function;
  update: Function;
  findFirst: Function;
}

export class AuthRepository {
  private getTable(nivel: 'primaria' | 'secundaria'): UserTable {
    return (nivel === 'primaria' ? prisma.usuariosPrimaria : prisma.usuariosSecundaria) as UserTable;
  }

  async findByEmail(email: string, nivel: 'primaria' | 'secundaria'): Promise<UsuariosPrimaria | UsuariosSecundaria | null> {
    return await this.getTable(nivel).findUnique({
      where: { email }
    });
  }

  async create(data: { email: string; contrasena: string; tipo_cuenta?: string }, nivel: 'primaria' | 'secundaria'): Promise<UsuariosPrimaria | UsuariosSecundaria | null> {
    const table = this.getTable(nivel);
    return await table.create({ data });
  }

  async findById(id: number, nivel: 'primaria' | 'secundaria'): Promise<UsuariosPrimaria | UsuariosSecundaria | null> {
    return await this.getTable(nivel).findUnique({
      where: { id }
    });
  }

  async updateRecoveryToken(id: number, token: string, expiracion: Date, nivel: 'primaria' | 'secundaria') {
    const table = this.getTable(nivel);
    return await table.update({
      where: { id },
      data: {
        token_recuperacion: token,
        expiracion_token: expiracion
      }
    });
  }

  async findByToken(token: string, nivel: 'primaria' | 'secundaria') {
    const table = this.getTable(nivel);
    return await table.findFirst({
      where: { token_recuperacion: token }
    })
  }

  async updatePassword(id: number, hashedPassword: string, nivel: 'primaria' | 'secundaria') {
    const table = this.getTable(nivel);
    return await table.update({
      where: { id },
      data: {
        contrasena: hashedPassword,
        token_recuperacion: null,
        expiracion_token: null
      }
    })
  }
}

export const authRepository = new AuthRepository();
