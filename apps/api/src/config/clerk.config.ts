import { createClerkClient } from '@clerk/clerk-sdk-node';
import { env } from './env.config';

export const clerkClient: ReturnType<typeof createClerkClient> = createClerkClient({
  secretKey: env.CLERK_SECRET_KEY,
});

export { env as clerkEnv };
