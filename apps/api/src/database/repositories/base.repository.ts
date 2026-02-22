import { supabaseAdmin } from '../supabase.client';
import type { SupabaseClient } from '@supabase/supabase-js';

export abstract class BaseRepository {
  protected readonly db: SupabaseClient = supabaseAdmin;
}
