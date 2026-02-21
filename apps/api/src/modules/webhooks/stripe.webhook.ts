import { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../../config/env.config';
import { pool } from '../../config/database.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('stripe-webhook');

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    log.warn('Stripe not configured — skipping webhook');
    res.json({ received: true });
    return;
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'] as string,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    log.warn('Stripe signature invalid', { error: (err as Error).message });
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  // Log the event
  await pool.query(
    `INSERT INTO stripe_events (event_id, event_type, customer_id, subscription_id, data)
     VALUES ($1, $2, $3, $4, $5) ON CONFLICT (event_id) DO NOTHING`,
    [
      event.id, event.type,
      (event.data.object as Record<string, string>).customer ?? null,
      (event.data.object as Record<string, string>).id ?? null,
      JSON.stringify(event.data.object),
    ]
  ).catch(() => {});

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await pool.query(
        `UPDATE businesses
         SET subscription_status = $1, stripe_subscription_id = $2, updated_at = NOW()
         WHERE stripe_customer_id = $3`,
        [sub.status, sub.id, sub.customer as string]
      ).catch(() => {});
      log.info('Subscription updated', { subscriptionId: sub.id, status: sub.status });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await pool.query(
        `UPDATE businesses SET subscription_status = 'cancelled', status = 'cancelled',
         updated_at = NOW() WHERE stripe_customer_id = $1`,
        [sub.customer as string]
      ).catch(() => {});
      break;
    }

    default:
      log.debug('Unhandled Stripe event', { type: event.type });
  }

  res.json({ received: true });
}
