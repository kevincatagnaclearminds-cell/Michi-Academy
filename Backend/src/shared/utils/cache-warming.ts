import { log } from './logger';
import { setCache, cacheKey } from './cache';

export class CacheWarmer {
  static async warmUserCache(userIds: string[], fetchFn: (id: string) => Promise<any>, ttl?: number) {
    log.info('Starting cache warming for users', { count: userIds.length });

    const promises = userIds.map(async (userId) => {
      try {
        const data = await fetchFn(userId);
        await setCache(cacheKey('user', userId), data, ttl);
        return { userId, success: true };
      } catch (error) {
        log.error('Cache warming failed for user', { userId, error });
        return { userId, success: false };
      }
    });

    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.success).length;

    log.info('Cache warming completed', {
      total: userIds.length,
      success: successCount,
      failed: userIds.length - successCount,
    });

    return results;
  }

  static async warmCache<T>(
    items: Array<{ key: string; fetchFn: () => Promise<T> }>,
    ttl?: number
  ) {
    log.info('Starting cache warming', { count: items.length });

    const promises = items.map(async ({ key, fetchFn }) => {
      try {
        const data = await fetchFn();
        await setCache(key, data, ttl);
        return { key, success: true };
      } catch (error) {
        log.error('Cache warming failed', { key, error });
        return { key, success: false };
      }
    });

    const results = await Promise.all(promises);
    const successCount = results.filter(r => r.success).length;

    log.info('Cache warming completed', {
      total: items.length,
      success: successCount,
      failed: items.length - successCount,
    });

    return results;
  }
}
