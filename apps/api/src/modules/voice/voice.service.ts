import twilio from 'twilio';
import { env } from '../../config/env.config';
import { supabaseAdmin } from '../../database/supabase.client';
import { createLogger } from '../../utils/logger';
import { NotFoundError } from '../../utils/errors';

const log = createLogger('voice-service');

export class VoiceService {
  /**
   * Look up the business ID by the Twilio number that received the call.
   * Falls back to a test business in development mode.
   */
  async getBusinessByTwilioNumber(twilioNumber: string): Promise<{ id: string; businessName: string } | null> {
    const { data } = await supabaseAdmin
      .from('businesses')
      .select('id, business_name')
      .eq('twilio_number', twilioNumber)
      .is('deleted_at', null)
      .maybeSingle();

    if (data) return { id: data.id as string, businessName: data.business_name as string };

    // Development fallback — use the first active business
    if (env.NODE_ENV === 'development') {
      const { data: fallback } = await supabaseAdmin
        .from('businesses')
        .select('id, business_name')
        .is('deleted_at', null)
        .limit(1)
        .maybeSingle();
      return fallback ? { id: fallback.id as string, businessName: fallback.business_name as string } : null;
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
    const { data } = await supabaseAdmin
      .from('calls')
      .select('*, customers(name, phone)')
      .eq('call_sid', callSid)
      .maybeSingle();
    if (!data) throw new NotFoundError('Call');
    return data;
  }

  async getRecentCalls(businessId: string, limit = 50) {
    const { data } = await supabaseAdmin
      .from('calls')
      .select('id, call_sid, customer_phone, duration, urgency, issue_type, outcome, lead_score, created_at, customers(name)')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data ?? [];
  }

  async updateCallOutcome(callSid: string, outcome: string, leadScore?: number) {
    await supabaseAdmin
      .from('calls')
      .update({ outcome, lead_score: leadScore ?? null })
      .eq('call_sid', callSid);
    log.info('Call outcome updated', { callSid, outcome });
  }
}
