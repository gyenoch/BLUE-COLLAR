import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  API_BASE_URL: z.string().url().default('http://localhost:3001'),

  // Database
  DATABASE_URL: z.string().min(1),
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_KEY: z.string().min(1).optional(),

  // Cache
  UPSTASH_REDIS_URL: z.string().url(),
  UPSTASH_REDIS_TOKEN: z.string().min(1),

  // Auth
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Twilio
  TWILIO_ACCOUNT_SID: z.string().min(1),
  TWILIO_AUTH_TOKEN: z.string().min(1),
  TWILIO_PHONE_NUMBER: z.string().min(1),

  // AI
  ANTHROPIC_API_KEY: z.string().min(1),
  DEEPGRAM_API_KEY: z.string().min(1),
  ELEVENLABS_API_KEY: z.string().min(1),
  ELEVENLABS_VOICE_ID: z.string().default('21m00Tcm4TlvDq8ikWAM'),

  // Integrations
  GOOGLE_CLIENT_ID: z.string().min(1).optional(),
  GOOGLE_CLIENT_SECRET: z.string().min(1).optional(),
  GOOGLE_REDIRECT_URI: z.string().url().optional(),
  JOBBER_CLIENT_ID: z.string().min(1).optional(),
  JOBBER_CLIENT_SECRET: z.string().min(1).optional(),

  // Stripe
  STRIPE_SECRET_KEY: z.string().min(1).optional(),
  STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

  // Email
  RESEND_API_KEY: z.string().min(1).optional(),
  EMAIL_FROM: z.string().email().default('noreply@bluecollaragent.com'),

  // Monitoring
  SENTRY_DSN: z.string().url().optional(),
});

type Env = z.infer<typeof envSchema>;

let _env: Env;

export function getEnv(): Env {
  if (!_env) {
    const result = envSchema.safeParse(process.env);
    if (!result.success) {
      console.error('❌  Invalid environment variables:\n', result.error.format());
      process.exit(1);
    }
    _env = result.data;
  }
  return _env;
}

export const env = new Proxy({} as Env, {
  get(_target, prop) {
    return getEnv()[prop as keyof Env];
  },
});
