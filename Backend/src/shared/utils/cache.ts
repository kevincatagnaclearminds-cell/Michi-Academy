import { redis } from '../../config/redis';
import { env } from '../../config/env';
import { log } from './logger';

export async function getCache<T>(key: string): Promise<T | null> {
  if (!redis) {
    return null;
  }

  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached) as T;
    }
    return null;
  } catch (error) {
    log.error('Cache get error', { key, error });
    return null;
  }
}

export async function setCache<T>(
  key: string,
  value: T,
  ttl: number = env.REDIS_TTL
): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    await redis.setex(key, ttl, JSON.stringify(value));
    return true;
  } catch (error) {
    log.error('Cache set error', { key, error });
    return false;
  }
}

export async function deleteCache(key: string): Promise<boolean> {
  if (!redis) {
    return false;
  }

  try {
    await redis.del(key);
    return true;
  } catch (error) {
    log.error('Cache delete error', { key, error });
    return false;
  }
}

export async function deleteCachePattern(pattern: string): Promise<number> {
  if (!redis) {
    return 0;
  }

  try {
    const keys = await redis.keys(pattern);
    if (keys.length === 0) {
      return 0;
    }
    return await redis.del(...keys);
  } catch (error) {
    log.error('Cache delete pattern error', { pattern, error });
    return 0;
  }
}

export function cacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`;
}

export async function getOrSetCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl?: number
): Promise<T> {
  const cached = await getCache<T>(key);
  if (cached !== null) {
    return cached;
  }

  const data = await fetchFn();
  await setCache(key, data, ttl);
  return data;
}
