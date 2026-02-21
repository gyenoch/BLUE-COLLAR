import { Resend } from 'resend';
import { env } from '../../config/env.config';
import { pool } from '../../config/database.config';
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
    await pool.query(
      `INSERT INTO messages
         (business_id, customer_id, appointment_id,
          direction, channel, message_type, subject, message_text,
          status, provider_id, error_message)
       VALUES ($1,$2,$3,'outbound','email',$4,$5,$6,$7,$8,$9)`,
      [
        payload.businessId ?? null,
        payload.customerId ?? null,
        payload.appointmentId ?? null,
        payload.messageType ?? null,
        payload.subject,
        payload.html,
        status,
        providerId,
        errorMessage ?? null,
      ]
    ).catch((err) => log.error('Failed to log email', { error: (err as Error).message }));
  }
}
