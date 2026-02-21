import { Router } from 'express';
import express from 'express';
import { handleClerkWebhook } from './clerk.webhook';
import { handleStripeWebhook } from './stripe.webhook';
import { handleCallStatus, handleSmsStatus } from './twilio.webhook';
import { webhookLimiter } from '../../middleware/rate-limiter.middleware';

const router = Router();

// Stripe needs raw body for signature verification
router.post(
  '/stripe',
  express.raw({ type: 'application/json' }),
  webhookLimiter,
  handleStripeWebhook
);

// Clerk uses JSON + svix signature
router.post('/clerk', webhookLimiter, handleClerkWebhook);

// Twilio status callbacks
router.post('/twilio/call-status', webhookLimiter, handleCallStatus);
router.post('/twilio/sms-status', webhookLimiter, handleSmsStatus);

export default router;
