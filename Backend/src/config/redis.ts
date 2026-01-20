import Redis from 'ioredis';
import { env } from './env';
import { log } from '../shared/utils/logger';

declare global {
  // eslint-disable-next-line no-var
  var redis: Redis | undefined;
}

let redisClient: Redis | null = null;

export const getRedisClient = (): Redis | null => {
  // Solo conectar si REDIS_URL está explícitamente definido
  if (!env.REDIS_URL) {
    log.warn('Redis not configured, caching will be disabled');
    return null;
  }

  if (redisClient) {
    return redisClient;
  }

  try {
    if (env.REDIS_URL) {
      redisClient = new Redis(env.REDIS_URL, {
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });
    } else {
      redisClient = new Redis({
        host: env.REDIS_HOST || 'localhost',
        port: parseInt(env.REDIS_PORT, 10),
        password: env.REDIS_PASSWORD || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          return delay;
        },
        maxRetriesPerRequest: 3,
      });
    }

    redisClient.on('connect', () => {
      log.info('Redis connected successfully');
    });

    redisClient.on('error', (err) => {
      log.error('Redis connection error', { error: err.message });
    });

    if (env.NODE_ENV !== 'production') {
      global.redis = redisClient;
    }

    return redisClient;
  } catch (error) {
    log.error('Failed to create Redis client', { error });
    return null;
  }
};

export const redis = getRedisClient();
