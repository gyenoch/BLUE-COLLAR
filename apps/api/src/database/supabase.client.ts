import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.config';

/** Anon client — safe for public data, respects RLS */
export const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

/** Service client — bypasses RLS, server-side use only */
export const supabaseAdmin = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_KEY ?? env.SUPABASE_ANON_KEY
);

/**
 * Upload a buffer to Supabase Storage and return the public URL.
 */
export async function uploadFile(
  bucket: string,
  path: string,
  data: Buffer,
  contentType: string
): Promise<string> {
  const { error } = await supabaseAdmin.storage.from(bucket).upload(path, data, {
    contentType,
    upsert: true,
  });
  if (error) throw new Error(`Storage upload failed: ${error.message}`);

  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
  return urlData.publicUrl;
}
