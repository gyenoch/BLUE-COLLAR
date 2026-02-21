export type Language = 'en' | 'es';

export type ConversationPhase =
  | 'greeting'
  | 'triage'
  | 'booking'
  | 'confirmation'
  | 'transfer'
  | 'complete';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface BookingInfo {
  customerName?: string;
  address?: string;
  phone?: string;
  issueDescription?: string;
  preferredTime?: string;
}

export interface ConversationState {
  callSid: string;
  businessId: string;
  customerPhone: string;
  language: Language;
  phase: ConversationPhase;
  messages: Message[];
  booking: BookingInfo;
  urgency?: 'emergency' | 'urgent' | 'routine';
  issueType?: string;
  leadScore: number;
  startedAt: Date;
  lastActivityAt: Date;
  isSpeaking: boolean;      // AI is currently speaking
  isInterrupted: boolean;   // Customer interrupted AI
}

export interface BusinessContext {
  businessId: string;
  businessName: string;
  tradeType: 'plumbing' | 'hvac' | 'electrical';
  ownerPhone: string;
  serviceCallFee: number;
  emergencyFee: number;
  hourlyRate?: number;
  businessHours?: Record<string, { open: string; close: string; closed?: boolean }>;
  timezone: string;
}
