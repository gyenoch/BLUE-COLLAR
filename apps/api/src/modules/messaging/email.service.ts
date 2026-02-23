import { Resend } from 'resend';
import { env } from '../../config/env.config';
import { supabaseAdmin } from '../../database/supabase.client';
import { createLogger } from '../../utils/logger';
import type { EmailPayload } from './types';

const log = createLogger('email-service');

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

const FROM_DEFAULT = 'Blue-Collar Agent <noreply@bluecollaragent.com>';

export class EmailService {
  async send(payload: EmailPayload): Promise<string | null> {
    if (!resend) {
      log.warn('Resend not configured — skipping email');
      return null;
    }

    try {
      const { data, error } = await resend.emails.send({
        from: payload.from ?? FROM_DEFAULT,
        to: payload.to,
        subject: payload.subject,
        html: payload.html,
      });

      if (error) throw new Error(error.message);

      await this.logMessage(payload, data?.id ?? null, 'sent');
      log.info('Email sent', { to: payload.to, subject: payload.subject });
      return data?.id ?? null;
    } catch (err) {
      log.error('Failed to send email', { to: payload.to, error: (err as Error).message });
      await this.logMessage(payload, null, 'failed', (err as Error).message);
      return null;
    }
  }

  private async logMessage(
    payload: EmailPayload,
    providerId: string | null,
    status: string,
    errorMessage?: string
  ): Promise<void> {
    const { error } = await supabaseAdmin.from('messages').insert({
      business_id:    payload.businessId ?? null,
      customer_id:    payload.customerId ?? null,
      appointment_id: payload.appointmentId ?? null,
      direction:      'outbound',
      channel:        'email',
      message_type:   payload.messageType ?? null,
      subject:        payload.subject,
      message_text:   payload.html,
      status,
      provider_id:    providerId,
      error_message:  errorMessage ?? null,
    });
    if (error) log.warn('Failed to log email', { error: error.message });
  }
}
