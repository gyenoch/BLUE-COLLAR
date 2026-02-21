import { getAIResponse } from './clients/claude.client';
import { textToSpeech, audioToBase64 } from './clients/elevenlabs.client';
import { ConversationStateManager } from './conversation-state.manager';
import { BusinessContext, ConversationState } from './types';
import { detectSpanish } from '../../utils/helpers';
import { createLogger } from '../../utils/logger';
import { pool } from '../../config/database.config';

const log = createLogger('conversation-service');
const stateManager = new ConversationStateManager();

export class ConversationService {
  /**
   * Process customer speech and return AI audio response as base64.
   * Returns null if AI has nothing to say (e.g., mid-sentence).
   */
  async processTranscript(
    callSid: string,
    transcript: string
  ): Promise<{ audioBase64: string; text: string } | null> {
    const state = await stateManager.get(callSid);
    if (!state) {
      log.warn('No state for call', { callSid });
      return null;
    }

    // Detect Spanish
    if (state.language === 'en' && detectSpanish(transcript)) {
      await stateManager.setLanguage(callSid, 'es');
      state.language = 'es';
    }

    // Add customer message to history
    await stateManager.addMessage(callSid, 'user', transcript);

    // Get fresh state after adding message
    const freshState = await stateManager.get(callSid);
    if (!freshState) return null;

    // Load business context
    const context = await this.getBusinessContext(freshState.businessId);
    if (!context) return null;

    // Get AI response
    const aiText = await getAIResponse(freshState.messages, context, freshState.language);
    if (!aiText.trim()) return null;

    // Add AI response to history
    await stateManager.addMessage(callSid, 'assistant', aiText);

    // Convert to speech
    const audio = await textToSpeech(aiText);
    const audioBase64 = audioToBase64(audio);

    log.info('AI response generated', {
      callSid,
      transcript: transcript.slice(0, 50),
      response: aiText.slice(0, 80),
    });

    return { audioBase64, text: aiText };
  }

  /**
   * Generate the initial greeting and return it as audio.
   */
  async generateGreeting(
    callSid: string,
    businessId: string,
    customerPhone: string
  ): Promise<{ audioBase64: string; text: string }> {
    // Create conversation state
    await stateManager.create(callSid, businessId, customerPhone);

    const context = await this.getBusinessContext(businessId);
    const greetingText = context
      ? `Thank you for calling ${context.businessName}, this is Sarah, how can I help you today?`
      : "Thank you for calling, this is Sarah, how can I help you today?";

    const audio = await textToSpeech(greetingText);
    await stateManager.addMessage(callSid, 'assistant', greetingText);

    return { audioBase64: audioToBase64(audio), text: greetingText };
  }

  async getState(callSid: string): Promise<ConversationState | null> {
    return stateManager.get(callSid);
  }

  async cleanup(callSid: string): Promise<ConversationState | null> {
    const state = await stateManager.get(callSid);
    await stateManager.delete(callSid);
    return state;
  }

  private async getBusinessContext(businessId: string): Promise<BusinessContext | null> {
    try {
      const result = await pool.query(
        `SELECT id, business_name, trade_type, owner_phone, pricing, timezone
         FROM businesses WHERE id = $1 AND deleted_at IS NULL`,
        [businessId]
      );
      const row = result.rows[0];
      if (!row) return null;

      const pricing = row.pricing ?? {};
      return {
        businessId: row.id,
        businessName: row.business_name,
        tradeType: row.trade_type,
        ownerPhone: row.owner_phone,
        serviceCallFee: pricing.service_call ?? 99,
        emergencyFee: pricing.emergency_fee ?? 175,
        hourlyRate: pricing.hourly_rate,
        timezone: row.timezone ?? 'America/New_York',
      };
    } catch (err) {
      log.error('Failed to load business context', { businessId, error: (err as Error).message });
      return null;
    }
  }
}
