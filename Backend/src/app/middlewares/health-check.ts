import { Request, Response } from 'express';
import { prisma } from '../../config/prisma';
import { redis } from '../../config/redis';
import { log } from '../../shared/utils/logger';

interface HealthStatus {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  uptime: number;
  checks: {
    database: {
      status: 'ok' | 'error';
      responseTime?: number;
      error?: string;
    };
    redis: {
      status: 'ok' | 'error' | 'disabled';
      responseTime?: number;
      error?: string;
    };
  };
}

export const healthCheck = async (req: Request, res: Response) => {
  const startTime = Date.now();
  const healthStatus: HealthStatus = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      database: { status: 'error' },
      redis: { status: 'disabled' },
    },
  };

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    healthStatus.checks.database = {
      status: 'ok',
      responseTime: Date.now() - dbStart,
    };
  } catch (error: any) {
    healthStatus.checks.database = {
      status: 'error',
      error: error.message,
    };
    healthStatus.status = 'down';
    log.error('Database health check failed', { error: error.message });
  }

  if (redis) {
    try {
      const redisStart = Date.now();
      await redis.ping();
      healthStatus.checks.redis = {
        status: 'ok',
        responseTime: Date.now() - redisStart,
      };
    } catch (error: any) {
      healthStatus.checks.redis = {
        status: 'error',
        error: error.message,
      };
      if (healthStatus.status === 'ok') {
        healthStatus.status = 'degraded';
      }
      log.warn('Redis health check failed', { error: error.message });
    }
  } else {
    healthStatus.checks.redis = {
      status: 'disabled',
    };
  }

  const statusCode = healthStatus.status === 'ok' ? 200 : healthStatus.status === 'degraded' ? 200 : 503;
  
  res.status(statusCode).json({
    ...healthStatus,
    responseTime: Date.now() - startTime,
  });
};
