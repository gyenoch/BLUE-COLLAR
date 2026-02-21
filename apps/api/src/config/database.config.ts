import { Pool, PoolConfig } from 'pg';
import { env } from './env.config';
import { createLogger } from '../utils/logger';

const log = createLogger('database');

const poolConfig: PoolConfig = {
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 20,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
};

export const pool = new Pool(poolConfig);

pool.on('connect', () => {
  log.debug('New DB client connected');
});

pool.on('error', (err) => {
  log.error('Unexpected DB client error', { error: err.message });
});

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    log.info('Database connection OK');
    return true;
  } catch (err) {
    log.error('Database connection failed', { error: (err as Error).message });
    return false;
  }
}
