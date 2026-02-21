export interface CustomerSummary {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  state: string | null;
  language: string;
  lifetimeValue: number;
  totalJobs: number;
  lastServiceDate: Date | null;
  tags: string[] | null;
  createdAt: Date;
}

export interface CustomerDetail extends CustomerSummary {
  address: string | null;
  zip: string | null;
  latitude: number | null;
  longitude: number | null;
  preferredContact: string;
  internalNotes: string | null;
  stripeCustomerId: string | null;
  jobberId: string | null;
  recentCalls: CustomerCall[];
  upcomingAppointments: CustomerAppointment[];
}

export interface CustomerCall {
  id: string;
  callSid: string | null;
  urgency: string | null;
  outcome: string | null;
  leadScore: number | null;
  createdAt: Date;
}

export interface CustomerAppointment {
  id: string;
  scheduledTime: Date;
  serviceType: string | null;
  status: string;
  actualCost: number | null;
}

export interface CustomerUpdateRequest {
  name?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  language?: 'en' | 'es';
  preferredContact?: 'phone' | 'sms' | 'email';
  internalNotes?: string;
  tags?: string[];
}
