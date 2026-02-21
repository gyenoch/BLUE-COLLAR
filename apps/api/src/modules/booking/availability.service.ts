import { pool } from '../../config/database.config';
import { createLogger } from '../../utils/logger';
import type { TimeSlot, AvailabilityWindow, BusinessHours, SlotQuery } from './types';

const log = createLogger('availability-service');

const DAY_NAMES = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export class AvailabilityService {
  /**
   * Return 30-minute slots for a given date based on the business's
   * configured hours. Excludes slots already taken by existing appointments.
   */
  async getAvailableSlots(query: SlotQuery): Promise<AvailabilityWindow> {
    const { businessId, date, durationMinutes = 60 } = query;

    // Load business hours + timezone
    const bizRow = await pool.query(
      `SELECT business_hours, timezone FROM businesses WHERE id = $1`,
      [businessId]
    );
    if (!bizRow.rows.length) {
      return { date, dayOfWeek: '', slots: [] };
    }

    const { business_hours: hours, timezone } = bizRow.rows[0] as {
      business_hours: BusinessHours | null;
      timezone: string;
    };

    const targetDate = new Date(`${date}T00:00:00`);
    const dayName = DAY_NAMES[targetDate.getDay()];
    const dayHours = hours?.[dayName] ?? null;

    if (!dayHours) {
      return { date, dayOfWeek: dayName, slots: [] };
    }

    // Build candidate slots every 30 minutes within open/close window
    const slots = this.buildSlots(date, dayHours.open, dayHours.close, durationMinutes, timezone);

    // Load booked appointments for that day
    const bookedRows = await pool.query(
      `SELECT scheduled_time, duration_minutes FROM appointments
       WHERE business_id = $1
         AND scheduled_time::date = $2::date
         AND status NOT IN ('cancelled', 'no_show')`,
      [businessId, date]
    );

    const booked = bookedRows.rows as { scheduled_time: Date; duration_minutes: number }[];

    // Mark slots that overlap with existing appointments
    for (const slot of slots) {
      for (const appt of booked) {
        const apptStart = new Date(appt.scheduled_time).getTime();
        const apptEnd = apptStart + appt.duration_minutes * 60_000;
        const slotStart = slot.start.getTime();
        const slotEnd = slot.end.getTime();

        if (slotStart < apptEnd && slotEnd > apptStart) {
          slot.available = false;
          break;
        }
      }
    }

    log.debug('Availability computed', { date, dayName, total: slots.length });
    return { date, dayOfWeek: dayName, slots };
  }

  /** Get next N available dates that have at least one open slot. */
  async getNextAvailableDates(businessId: string, count = 5): Promise<string[]> {
    const available: string[] = [];
    const today = new Date();

    for (let i = 0; i < 30 && available.length < count; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      const window = await this.getAvailableSlots({ businessId, date: dateStr });
      if (window.slots.some((s) => s.available)) {
        available.push(dateStr);
      }
    }

    return available;
  }

  private buildSlots(
    date: string,
    openTime: string,    // '08:00'
    closeTime: string,   // '17:00'
    durationMinutes: number,
    _timezone: string
  ): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [openH, openM] = openTime.split(':').map(Number);
    const [closeH, closeM] = closeTime.split(':').map(Number);

    const openMs  = (openH  * 60 + openM)  * 60_000;
    const closeMs = (closeH * 60 + closeM)  * 60_000;
    const stepMs  = 30 * 60_000;
    const durMs   = durationMinutes * 60_000;

    const baseDate = new Date(`${date}T00:00:00Z`);

    for (let ms = openMs; ms + durMs <= closeMs; ms += stepMs) {
      const start = new Date(baseDate.getTime() + ms);
      const end   = new Date(start.getTime() + durMs);
      slots.push({ start, end, available: true });
    }

    return slots;
  }
}
