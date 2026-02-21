import twilio from 'twilio';
import { env } from './env.config';
import { createLogger } from '../utils/logger';

const log = createLogger('twilio');

export const twilioClient = twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);

/**
 * Send an SMS via Twilio.
 */
export async function sendSms(to: string, body: string): Promise<string> {
  const msg = await twilioClient.messages.create({
    from: env.TWILIO_PHONE_NUMBER,
    to,
    body,
  });
  log.info('SMS sent', { to, sid: msg.sid });
  return msg.sid;
}

/**
 * Make an outbound call and execute TwiML at the given url.
 */
export async function makeCall(to: string, twimlUrl: string): Promise<string> {
  const call = await twilioClient.calls.create({
    from: env.TWILIO_PHONE_NUMBER,
    to,
    url: twimlUrl,
  });
  log.info('Outbound call initiated', { to, callSid: call.sid });
  return call.sid;
}

/**
 * Verify a Twilio request signature.
 */
export function validateTwilioSignature(
  url: string,
  params: Record<string, string>,
  signature: string
): boolean {
  return twilio.validateRequest(env.TWILIO_AUTH_TOKEN, signature, url, params);
}
