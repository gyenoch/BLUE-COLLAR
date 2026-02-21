import { Pool, PoolClient, QueryResult } from 'pg';
import { pool } from '../connection';

/**
 * Thin base class that provides typed query helpers and optional
 * transaction support. Subclasses call `this.query()` / `this.queryOne()`.
 */
export abstract class BaseRepository {
  protected readonly pool: Pool = pool;

  /** Run a parameterised query and return all rows. */
  protected async query<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T[]> {
    const result: QueryResult<any> = await this.pool.query(sql, params);
    return result.rows as T[];
  }

  /** Run a query and return the first row, or null. */
  protected async queryOne<T = Record<string, unknown>>(
    sql: string,
    params?: unknown[]
  ): Promise<T | null> {
    const rows = await this.query<T>(sql, params);
    return rows[0] ?? null;
  }

  /** Run multiple queries in a single transaction. */
  protected async transaction<T>(
    fn: (client: PoolClient) => Promise<T>
  ): Promise<T> {
    const client = await this.pool.connect();
    try {
      await client.query('BEGIN');
      const result = await fn(client);
      await client.query('COMMIT');
      return result;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}
