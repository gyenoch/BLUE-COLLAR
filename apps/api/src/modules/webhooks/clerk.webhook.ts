import { Request, Response } from 'express';
import { Webhook } from 'svix';
import { env } from '../../config/env.config';
import { AuthService } from '../auth/auth.service';
import { pool } from '../../config/database.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('clerk-webhook');
const authService = new AuthService();

export async function handleClerkWebhook(req: Request, res: Response): Promise<void> {
  const webhookSecret = env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    log.warn('CLERK_WEBHOOK_SECRET not set — skipping verification');
    res.json({ received: true });
    return;
  }

  const wh = new Webhook(webhookSecret);
  let event: { type: string; data: Record<string, unknown> };

  try {
    event = wh.verify(req.body, {
      'svix-id': req.headers['svix-id'] as string,
      'svix-timestamp': req.headers['svix-timestamp'] as string,
      'svix-signature': req.headers['svix-signature'] as string,
    }) as typeof event;
  } catch (err) {
    log.warn('Clerk webhook signature invalid', { error: (err as Error).message });
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  // Log event
  await pool.query(
    `INSERT INTO clerk_events (event_type, clerk_user_id, data) VALUES ($1, $2, $3)`,
    [event.type, (event.data.id as string) ?? null, JSON.stringify(event.data)]
  ).catch(() => {});

  switch (event.type) {
    case 'user.updated':
      await authService.syncUserData(event.data.id as string);
      break;

    case 'user.deleted':
      await authService.deactivateBusiness(event.data.id as string);
      break;

    case 'user.created':
      // No action — wait for onboarding
      break;

    default:
      log.debug('Unhandled Clerk event', { type: event.type });
  }

  res.json({ received: true });
}
