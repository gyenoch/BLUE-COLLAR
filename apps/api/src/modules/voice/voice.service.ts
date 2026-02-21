import twilio from 'twilio';
import { env } from '../../config/env.config';
import { pool } from '../../config/database.config';
import { createLogger } from '../../utils/logger';
import { NotFoundError } from '../../utils/errors';

const log = createLogger('voice-service');

export class VoiceService {
  /**
   * Look up the business ID by the Twilio number that received the call.
   * Falls back to a test business in development mode.
   */
  async getBusinessByTwilioNumber(twilioNumber: string): Promise<{ id: string; businessName: string } | null> {
    const result = await pool.query(
      `SELECT id, business_name FROM businesses
       WHERE twilio_number = $1 AND deleted_at IS NULL`,
      [twilioNumber]
    );

    if (result.rows[0]) return result.rows[0];

    // Development fallback — use the first active business
    if (env.NODE_ENV === 'development') {
      const fallback = await pool.query(
        `SELECT id, business_name FROM businesses WHERE deleted_at IS NULL LIMIT 1`
      );
      return fallback.rows[0] ?? null;
    }

    return null;
  }

  /**
   * Generate TwiML that opens a bidirectional media stream WebSocket.
   * Twilio will stream audio to our WebSocket server at /media-stream.
   */
  generateMediaStreamTwiml(params: {
    businessId: string;
    customerPhone: string;
    wsBaseUrl: string;
  }): string {
    const { VoiceResponse } = twilio.twiml;
    const response = new VoiceResponse();

    const connect = response.connect();
    const streamUrl = `${params.wsBaseUrl}/media-stream?businessId=${params.businessId}&customerPhone=${encodeURIComponent(params.customerPhone)}`;
    connect.stream({ url: streamUrl });

    return response.toString();
  }

  /**
   * Generate TwiML to forward call to a human (owner/tech).
   */
  generateForwardTwiml(forwardTo: string, message?: string): string {
    const { VoiceResponse } = twilio.twiml;
    const response = new VoiceResponse();
    if (message) {
      response.say({ voice: 'alice' }, message);
    }
    response.dial(forwardTo);
    return response.toString();
  }

  /**
   * Generate TwiML for voicemail (fallback when system is down).
   */
  generateVoicemailTwiml(businessName: string): string {
    const { VoiceResponse } = twilio.twiml;
    const response = new VoiceResponse();
    response.say(
      { voice: 'alice' },
      `Thank you for calling ${businessName}. We're unable to take your call right now. Please leave a message after the tone and we'll call you back as soon as possible.`
    );
    response.record({ maxLength: 60, playBeep: true });
    return response.toString();
  }

  async getCallDetails(callSid: string) {
    const result = await pool.query(
      `SELECT c.*, cu.name as customer_name, cu.phone as customer_phone_number
       FROM calls c
       LEFT JOIN customers cu ON c.customer_id = cu.id
       WHERE c.call_sid = $1`,
      [callSid]
    );
    if (!result.rows[0]) throw new NotFoundError('Call');
    return result.rows[0];
  }

  async getRecentCalls(businessId: string, limit = 50) {
    const result = await pool.query(
      `SELECT c.id, c.call_sid, c.customer_phone, c.duration, c.urgency,
              c.issue_type, c.outcome, c.lead_score, c.created_at,
              cu.name as customer_name
       FROM calls c
       LEFT JOIN customers cu ON c.customer_id = cu.id
       WHERE c.business_id = $1
       ORDER BY c.created_at DESC
       LIMIT $2`,
      [businessId, limit]
    );
    return result.rows;
  }

  async updateCallOutcome(callSid: string, outcome: string, leadScore?: number) {
    await pool.query(
      `UPDATE calls SET outcome = $1, lead_score = $2 WHERE call_sid = $3`,
      [outcome, leadScore ?? null, callSid]
    );
    log.info('Call outcome updated', { callSid, outcome });
  }
}
