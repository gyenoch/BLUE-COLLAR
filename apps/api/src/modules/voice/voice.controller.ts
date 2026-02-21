import { Request, Response, NextFunction } from 'express';
import { VoiceService } from './voice.service';
import { env } from '../../config/env.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('voice-controller');
const voiceService = new VoiceService();

export class VoiceController {
  /**
   * POST /voice/incoming
   * Twilio webhook — called when a customer calls our number.
   * Returns TwiML that opens the media stream WebSocket.
   */
  async handleIncomingCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { To: twilioNumber, From: customerPhone, CallSid: callSid } = req.body;

      log.info('Incoming call', { twilioNumber, customerPhone, callSid });

      const business = await voiceService.getBusinessByTwilioNumber(twilioNumber);

      if (!business) {
        log.warn('No business found for Twilio number', { twilioNumber });
        const twiml = voiceService.generateVoicemailTwiml('our team');
        res.type('text/xml').send(twiml);
        return;
      }

      // Build WebSocket URL — for Twilio streams, use wss://
      const apiBaseUrl = env.API_BASE_URL;
      const wsBaseUrl = apiBaseUrl.replace(/^https?/, 'wss').replace(/^http/, 'ws');

      const twiml = voiceService.generateMediaStreamTwiml({
        businessId: business.id,
        customerPhone,
        wsBaseUrl,
      });

      log.info('Connecting call to AI stream', { callSid, businessId: business.id });
      res.type('text/xml').send(twiml);
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /voice/calls
   * Get recent calls for the authenticated business.
   */
  async getCalls(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authedReq = req as any;
      const businessId = authedReq.business?.id as string;
      const limit = parseInt((req.query.limit as string) ?? '50');
      const calls = await voiceService.getRecentCalls(businessId, limit);
      res.json({ calls });
    } catch (err) {
      next(err);
    }
  }

  /**
   * GET /voice/calls/:callSid
   */
  async getCall(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const call = await voiceService.getCallDetails(req.params.callSid);
      res.json({ call });
    } catch (err) {
      next(err);
    }
  }
}
