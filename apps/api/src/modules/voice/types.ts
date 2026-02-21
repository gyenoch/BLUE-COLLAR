export interface TwilioMediaMessage {
  event: 'connected' | 'start' | 'media' | 'stop' | 'mark';
  sequenceNumber?: string;
  streamSid?: string;
  start?: {
    streamSid: string;
    accountSid: string;
    callSid: string;
    customParameters: Record<string, string>;
    tracks: string[];
  };
  media?: {
    track: string;
    chunk: string;
    timestamp: string;
    payload: string; // base64-encoded mulaw audio
  };
  stop?: {
    accountSid: string;
    callSid: string;
  };
  mark?: {
    name: string;
  };
}

export interface TwilioOutboundMessage {
  event: 'media' | 'clear' | 'mark';
  streamSid: string;
  media?: {
    payload: string; // base64-encoded mulaw audio
  };
  mark?: {
    name: string;
  };
}

export interface ActiveCall {
  callSid: string;
  streamSid: string;
  businessId: string;
  customerPhone: string;
  startedAt: Date;
}
