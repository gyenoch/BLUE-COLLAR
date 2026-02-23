import { sendSms } from '../../config/twilio.config';
import { supabaseAdmin } from '../../database/supabase.client';
import { createLogger } from '../../utils/logger';
import type { SmsPayload, MessageType } from './types';
import { buildConfirmationSms } from './templates/sms/confirmation';
import { buildReminderSms } from './templates/sms/reminder';
import { buildOnTheWaySms } from './templates/sms/on-the-way';

const log = createLogger('sms-service');

export class SmsService {
  /** Send a raw SMS and log it to the messages table. */
  async send(payload: SmsPayload): Promise<string | null> {
    try {
      const sid = await sendSms(payload.to, payload.body);
      await this.logMessage(payload, sid, 'sent');
      return sid;
    } catch (err) {
      log.error('Failed to send SMS', { to: payload.to, error: (err as Error).message });
      await this.logMessage(payload, null, 'failed', (err as Error).message);
      return null;
    }
  }

  /** Send appointment confirmation SMS. */
  async sendConfirmation(opts: {
    to: string;
    customerName: string | null;
    businessName: string;
    scheduledTime: Date;
    serviceType: string | null;
    timezone: string;
    language?: string;
    businessId?: string;
    customerId?: string;
    appointmentId?: string;
  }): Promise<string | null> {
    const body = buildConfirmationSms(opts);
    return this.send({
      to: opts.to,
      body,
      businessId: opts.businessId,
      customerId: opts.customerId,
      appointmentId: opts.appointmentId,
      messageType: 'confirmation',
    });
  }

  /** Send day-before reminder SMS. */
  async sendReminder(opts: {
    to: string;
    customerName: string | null;
    businessName: string;
    businessPhone: string;
    scheduledTime: Date;
    timezone: string;
    language?: string;
    businessId?: string;
    customerId?: string;
    appointmentId?: string;
  }): Promise<string | null> {
    const body = buildReminderSms(opts);
    return this.send({
      to: opts.to,
      body,
      businessId: opts.businessId,
      customerId: opts.customerId,
      appointmentId: opts.appointmentId,
      messageType: 'reminder',
    });
  }

  /** Send tech-on-the-way notification. */
  async sendOnTheWay(opts: {
    to: string;
    customerName: string | null;
    technicianName: string;
    businessName: string;
    etaMinutes: number;
    language?: string;
    businessId?: string;
    customerId?: string;
    appointmentId?: string;
  }): Promise<string | null> {
    const body = buildOnTheWaySms(opts);
    return this.send({
      to: opts.to,
      body,
      businessId: opts.businessId,
      customerId: opts.customerId,
      appointmentId: opts.appointmentId,
      messageType: 'on_the_way',
    });
  }

  private async logMessage(
    payload: SmsPayload,
    providerId: string | null,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await supabaseAdmin.from('messages').insert({
      business_id:    payload.businessId ?? null,
      customer_id:    payload.customerId ?? null,
      appointment_id: payload.appointmentId ?? null,
      direction:      'outbound',
      channel:        'sms',
      message_type:   (payload.messageType as MessageType) ?? null,
      message_text:   payload.body,
      status,
      provider_id:    providerId,
      error_message:  errorMessage ?? null,
    });
    if (error) log.warn('Failed to log SMS', { error: error.message });
  }
}
