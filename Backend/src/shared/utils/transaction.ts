import { PrismaClient } from '@prisma/client';
import { prisma } from '../../config/prisma';

export async function transaction<T>(
  callback: (tx: PrismaClient) => Promise<T>
): Promise<T> {
  return await prisma.$transaction(async (tx) => {
    return await callback(tx as PrismaClient);
  });
}

export async function transactionBatch<T>(
  operations: Array<(tx: PrismaClient) => Promise<T>>
): Promise<T[]> {
  return await prisma.$transaction(async (tx) => {
    const results = await Promise.all(
      operations.map((op) => op(tx as PrismaClient))
    );
    return results;
  });
}
