import { redis } from '../../config/redis.config';
import { ConversationState, Language, BookingInfo } from './types';
import { createLogger } from '../../utils/logger';

const log = createLogger('conversation-state');
const STATE_TTL = 60 * 60; // 1 hour

function key(callSid: string) {
  return `call:${callSid}:state`;
}

export class ConversationStateManager {
  async create(callSid: string, businessId: string, customerPhone: string): Promise<ConversationState> {
    const state: ConversationState = {
      callSid,
      businessId,
      customerPhone,
      language: 'en',
      phase: 'greeting',
      messages: [],
      booking: {},
      leadScore: 0,
      startedAt: new Date(),
      lastActivityAt: new Date(),
      isSpeaking: false,
      isInterrupted: false,
    };
    await redis.setex(key(callSid), STATE_TTL, JSON.stringify(state));
    return state;
  }

  async get(callSid: string): Promise<ConversationState | null> {
    const raw = await redis.get<string>(key(callSid));
    if (!raw) return null;
    const state = JSON.parse(raw) as ConversationState;
    // Rehydrate Date objects
    state.startedAt = new Date(state.startedAt);
    state.lastActivityAt = new Date(state.lastActivityAt);
    return state;
  }

  async update(callSid: string, updates: Partial<ConversationState>): Promise<void> {
    const state = await this.get(callSid);
    if (!state) {
      log.warn('State not found for update', { callSid });
      return;
    }
    const updated = { ...state, ...updates, lastActivityAt: new Date() };
    await redis.setex(key(callSid), STATE_TTL, JSON.stringify(updated));
  }

  async addMessage(callSid: string, role: 'user' | 'assistant', content: string): Promise<void> {
    const state = await this.get(callSid);
    if (!state) return;
    state.messages.push({ role, content });
    // Keep last 30 messages to avoid hitting Claude's context limit
    if (state.messages.length > 30) state.messages = state.messages.slice(-30);
    await this.update(callSid, { messages: state.messages, lastActivityAt: new Date() });
  }

  async setLanguage(callSid: string, language: Language): Promise<void> {
    await this.update(callSid, { language });
  }

  async updateBooking(callSid: string, booking: Partial<BookingInfo>): Promise<void> {
    const state = await this.get(callSid);
    if (!state) return;
    await this.update(callSid, { booking: { ...state.booking, ...booking } });
  }

  async delete(callSid: string): Promise<void> {
    await redis.del(key(callSid));
  }
}
