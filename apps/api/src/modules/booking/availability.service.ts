import { supabaseAdmin } from '../../database/supabase.client';
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
    const { data: bizData } = await supabaseAdmin
      .from('businesses')
      .select('business_hours, timezone')
      .eq('id', businessId)
      .maybeSingle();

    if (!bizData) {
      return { date, dayOfWeek: '', slots: [] };
    }

    const hours = bizData.business_hours as BusinessHours | null;
    const timezone = bizData.timezone as string;

    const targetDate = new Date(`${date}T00:00:00`);
    const dayName = DAY_NAMES[targetDate.getDay()];
    const dayHours = hours?.[dayName] ?? null;

    if (!dayHours) {
      return { date, dayOfWeek: dayName, slots: [] };
    }

    // Build candidate slots every 30 minutes within open/close window
    const slots = this.buildSlots(date, dayHours.open, dayHours.close, durationMinutes, timezone);

    // Load booked appointments for that day
    const dayStart = `${date}T00:00:00`;
    const dayEnd   = `${date}T23:59:59`;

    const { data: bookedData } = await supabaseAdmin
      .from('appointments')
      .select('scheduled_time, duration_minutes')
      .eq('business_id', businessId)
      .gte('scheduled_time', dayStart)
      .lte('scheduled_time', dayEnd)
      .neq('status', 'cancelled')
      .neq('status', 'no_show');

    const booked = (bookedData ?? []) as { scheduled_time: string; duration_minutes: number }[];

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
