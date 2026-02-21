import { google } from 'googleapis';
import { pool } from '../../config/database.config';
import { env } from '../../config/env.config';
import { createLogger } from '../../utils/logger';

const log = createLogger('calendar-service');

export class CalendarService {
  private oauth2Client() {
    return new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      `${env.API_BASE_URL}/api/integrations/google/callback`
    );
  }

  /** Create a Google Calendar event for an appointment. */
  async createEvent(opts: {
    businessId: string;
    summary: string;
    description?: string;
    startTime: Date;
    durationMinutes: number;
    attendeeEmail?: string;
    timezone?: string;
  }): Promise<string | null> {
    const refreshToken = await this.getRefreshToken(opts.businessId);
    if (!refreshToken) {
      log.debug('No Google Calendar connected', { businessId: opts.businessId });
      return null;
    }

    try {
      const auth = this.oauth2Client();
      auth.setCredentials({ refresh_token: refreshToken });

      const calendar = google.calendar({ version: 'v3', auth });
      const endTime = new Date(opts.startTime.getTime() + opts.durationMinutes * 60_000);

      const event = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: {
          summary: opts.summary,
          description: opts.description,
          start: {
            dateTime: opts.startTime.toISOString(),
            timeZone: opts.timezone ?? 'America/New_York',
          },
          end: {
            dateTime: endTime.toISOString(),
            timeZone: opts.timezone ?? 'America/New_York',
          },
          attendees: opts.attendeeEmail ? [{ email: opts.attendeeEmail }] : [],
          reminders: {
            useDefault: false,
            overrides: [
              { method: 'email', minutes: 24 * 60 },
              { method: 'popup', minutes: 60 },
            ],
          },
        },
      });

      log.info('Calendar event created', { eventId: event.data.id });
      return event.data.id ?? null;
    } catch (err) {
      log.error('Failed to create calendar event', { error: (err as Error).message });
      return null;
    }
  }

  /** Update an existing Google Calendar event (e.g. reschedule). */
  async updateEvent(opts: {
    businessId: string;
    eventId: string;
    startTime?: Date;
    durationMinutes?: number;
    summary?: string;
  }): Promise<boolean> {
    const refreshToken = await this.getRefreshToken(opts.businessId);
    if (!refreshToken || !opts.eventId) return false;

    try {
      const auth = this.oauth2Client();
      auth.setCredentials({ refresh_token: refreshToken });
      const calendar = google.calendar({ version: 'v3', auth });

      const patch: Record<string, unknown> = {};
      if (opts.summary) patch.summary = opts.summary;
      if (opts.startTime) {
        const end = new Date(
          opts.startTime.getTime() + (opts.durationMinutes ?? 60) * 60_000
        );
        patch.start = { dateTime: opts.startTime.toISOString() };
        patch.end   = { dateTime: end.toISOString() };
      }

      await calendar.events.patch({
        calendarId: 'primary',
        eventId: opts.eventId,
        requestBody: patch,
      });

      return true;
    } catch (err) {
      log.error('Failed to update calendar event', { error: (err as Error).message });
      return false;
    }
  }

  /** Delete a Google Calendar event (on cancellation). */
  async deleteEvent(businessId: string, eventId: string): Promise<void> {
    const refreshToken = await this.getRefreshToken(businessId);
    if (!refreshToken || !eventId) return;

    try {
      const auth = this.oauth2Client();
      auth.setCredentials({ refresh_token: refreshToken });
      const calendar = google.calendar({ version: 'v3', auth });
      await calendar.events.delete({ calendarId: 'primary', eventId });
      log.info('Calendar event deleted', { eventId });
    } catch (err) {
      log.error('Failed to delete calendar event', { error: (err as Error).message });
    }
  }

  /** Generate the Google OAuth URL for a business to connect their calendar. */
  getAuthUrl(businessId: string): string {
    const auth = this.oauth2Client();
    return auth.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: ['https://www.googleapis.com/auth/calendar'],
      state: businessId,
    });
  }

  /** Exchange auth code for refresh token and store it. */
  async handleCallback(businessId: string, code: string): Promise<void> {
    const auth = this.oauth2Client();
    const { tokens } = await auth.getToken(code);

    if (!tokens.refresh_token) {
      throw new Error('No refresh token returned — ensure prompt=consent was used');
    }

    await pool.query(
      `UPDATE businesses
       SET google_calendar_refresh_token = $2, updated_at = NOW()
       WHERE id = $1`,
      [businessId, tokens.refresh_token]
    );

    log.info('Google Calendar connected', { businessId });
  }

  private async getRefreshToken(businessId: string): Promise<string | null> {
    const row = await pool.query(
      `SELECT google_calendar_refresh_token FROM businesses WHERE id = $1`,
      [businessId]
    );
    return (row.rows[0]?.google_calendar_refresh_token as string) ?? null;
  }
}
