import { Redis } from '@upstash/redis';
import { env } from './env.config';
import { createLogger } from '../utils/logger';

const log = createLogger('redis');

export const redis = new Redis({
  url: env.UPSTASH_REDIS_URL,
  token: env.UPSTASH_REDIS_TOKEN,
});

export async function testRedisConnection(): Promise<boolean> {
  try {
    await redis.ping();
    log.info('Redis connection OK');
    return true;
  } catch (err) {
    log.error('Redis connection failed', { error: (err as Error).message });
    return false;
  }
}

// ─── Helpers ────────────────────────────────────────────────
export async function cacheSet(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
  if (ttlSeconds) {
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  } else {
    await redis.set(key, JSON.stringify(value));
  }
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await redis.get<string>(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return raw as unknown as T;
  }
}

export async function cacheDel(key: string): Promise<void> {
  await redis.del(key);
}
