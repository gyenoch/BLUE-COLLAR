import { Request, Response } from 'express';
import { validateTwilioSignature } from '../../config/twilio.config';
import { env } from '../../config/env.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('twilio-webhook');

/**
 * Middleware to validate Twilio request signatures.
 * Use this on production webhook endpoints.
 */
export function validateTwilioRequest(req: Request, res: Response, next: () => void): void {
  if (env.NODE_ENV !== 'production') {
    next();
    return;
  }

  const signature = req.headers['x-twilio-signature'] as string;
  const url = `${env.API_BASE_URL}${req.path}`;
  const params = req.body as Record<string, string>;

  if (!validateTwilioSignature(url, params, signature)) {
    log.warn('Invalid Twilio signature', { url });
    res.status(403).json({ error: 'Invalid Twilio signature' });
    return;
  }
  next();
}

/**
 * POST /webhooks/twilio/status
 * Called by Twilio when call status changes (completed, failed, etc.)
 */
export async function handleCallStatus(req: Request, res: Response): Promise<void> {
  const { CallSid, CallStatus, CallDuration } = req.body;
  log.info('Call status update', { callSid: CallSid, status: CallStatus, duration: CallDuration });
  res.sendStatus(204);
}

/**
 * POST /webhooks/twilio/sms-status
 * SMS delivery status updates
 */
export async function handleSmsStatus(req: Request, res: Response): Promise<void> {
  const { MessageSid, MessageStatus } = req.body;
  log.info('SMS status update', { messageSid: MessageSid, status: MessageStatus });
  res.sendStatus(204);
}
