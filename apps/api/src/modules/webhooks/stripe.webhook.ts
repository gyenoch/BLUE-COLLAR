import { Request, Response } from 'express';
import Stripe from 'stripe';
import { env } from '../../config/env.config';
import { supabaseAdmin } from '../../database/supabase.client';
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

  // Log the event (ignore duplicate inserts)
  await supabaseAdmin
    .from('stripe_events')
    .upsert(
      {
        event_id: event.id,
        event_type: event.type,
        customer_id: (event.data.object as Record<string, string>).customer ?? null,
        subscription_id: (event.data.object as Record<string, string>).id ?? null,
        data: event.data.object,
      },
      { onConflict: 'event_id', ignoreDuplicates: true }
    )
    .then(({ error }) => {
      if (error) log.warn('Failed to log stripe event', { error: error.message });
    });

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from('businesses')
        .update({
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', sub.customer as string)
        .then(({ error }) => {
          if (error) log.warn('Failed to update subscription', { error: error.message });
        });
      log.info('Subscription updated', { subscriptionId: sub.id, status: sub.status });
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabaseAdmin
        .from('businesses')
        .update({
          subscription_status: 'cancelled',
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('stripe_customer_id', sub.customer as string)
        .then(({ error }) => {
          if (error) log.warn('Failed to cancel subscription', { error: error.message });
        });
      break;
    }

    default:
      log.debug('Unhandled Stripe event', { type: event.type });
  }

  res.json({ received: true });
}
