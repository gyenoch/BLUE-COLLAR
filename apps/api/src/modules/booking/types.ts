export interface TimeSlot {
  start: Date;
  end: Date;
  available: boolean;
}

export interface AvailabilityWindow {
  date: string;          // 'YYYY-MM-DD'
  dayOfWeek: string;     // 'monday'
  slots: TimeSlot[];
}

export interface BookingRequest {
  businessId: string;
  customerPhone: string;
  customerName?: string;
  customerEmail?: string;
  callId?: string;
  scheduledTime: Date;
  serviceType?: string;
  issueDescription?: string;
  urgency?: 'emergency' | 'urgent' | 'routine';
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  durationMinutes?: number;
  language?: string;
}

export interface BookingResult {
  appointmentId: string;
  customerId: string;
  scheduledTime: Date;
  confirmationSent: boolean;
  calendarEventId?: string;
}

export interface BusinessHours {
  [day: string]: { open: string; close: string } | null;
}

export interface SlotQuery {
  businessId: string;
  date: string;           // 'YYYY-MM-DD'
  durationMinutes?: number;
}
