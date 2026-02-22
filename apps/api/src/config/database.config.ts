import { supabaseAdmin } from '../database/supabase.client';
import { createLogger } from '../utils/logger';

const log = createLogger('database');

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin.from('businesses').select('id').limit(1);
    if (error) throw error;
    log.info('Database connection OK');
    return true;
  } catch (err) {
    log.error('Database connection failed', { error: (err as Error).message });
    return false;
  }
}
