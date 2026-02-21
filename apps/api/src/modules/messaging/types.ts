export interface SmsPayload {
  to: string;
  body: string;
  businessId?: string;
  customerId?: string;
  appointmentId?: string;
  messageType?: MessageType;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  from?: string;
  businessId?: string;
  customerId?: string;
  appointmentId?: string;
  messageType?: MessageType;
}

export type MessageType =
  | 'confirmation'
  | 'reminder'
  | 'on_the_way'
  | 'invoice'
  | 'review_request'
  | 'quote'
  | 'welcome';

export type MessageChannel = 'sms' | 'email';

export interface MessageRecord {
  id: string;
  businessId: string;
  customerId: string | null;
  appointmentId: string | null;
  direction: 'outbound' | 'inbound';
  channel: MessageChannel;
  messageType: MessageType | null;
  subject: string | null;
  messageText: string;
  status: 'queued' | 'sent' | 'delivered' | 'failed' | 'read';
  providerId: string | null;
  errorMessage: string | null;
  sentAt: Date;
}

export interface AppointmentDetails {
  id: string;
  scheduledTime: Date;
  serviceType: string | null;
  issueDescription: string | null;
  estimatedCostMin: number | null;
  estimatedCostMax: number | null;
  technicianName?: string;
}

export interface BusinessDetails {
  id: string;
  businessName: string;
  phone: string;
  ownerPhone?: string;
}

export interface CustomerDetails {
  id: string;
  name: string | null;
  phone: string;
  language: string;
}
