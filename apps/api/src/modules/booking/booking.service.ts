import { supabaseAdmin } from '../../database/supabase.client';
import { createLogger } from '../../utils/logger';
import { CustomerRepository } from '../../database/repositories/customer.repository';
import { AppointmentRepository } from '../../database/repositories/appointment.repository';
import { SmsService } from '../messaging/sms.service';
import { CalendarService } from './calendar.service';
import type { BookingRequest, BookingResult } from './types';

const log = createLogger('booking-service');

const customerRepo    = new CustomerRepository();
const appointmentRepo = new AppointmentRepository();
const smsService      = new SmsService();
const calendarService = new CalendarService();

export class BookingService {
  /**
   * Full booking flow:
   * 1. Upsert customer
   * 2. Create appointment
   * 3. Link to call record
   * 4. Send confirmation SMS
   * 5. Create Google Calendar event (if connected)
   */
  async book(req: BookingRequest): Promise<BookingResult> {
    log.info('Creating booking', {
      businessId: req.businessId,
      phone: req.customerPhone,
      time: req.scheduledTime,
    });

    // 1. Upsert customer
    const customer = await customerRepo.upsert({
      businessId:  req.businessId,
      phone:       req.customerPhone,
      name:        req.customerName,
      email:       req.customerEmail,
      language:    req.language,
    });

    // 2. Create appointment
    const appointment = await appointmentRepo.create({
      businessId:       req.businessId,
      customerId:       customer.id,
      callId:           req.callId,
      scheduledTime:    req.scheduledTime,
      serviceType:      req.serviceType,
      issueDescription: req.issueDescription,
      urgency:          req.urgency,
      estimatedCostMin: req.estimatedCostMin,
      estimatedCostMax: req.estimatedCostMax,
      durationMinutes:  req.durationMinutes ?? 60,
    });

    // 3. Mark call outcome as 'booked'
    if (req.callId) {
      await supabaseAdmin
        .from('calls')
        .update({ outcome: 'booked', customer_id: customer.id })
        .eq('id', req.callId)
        .then(({ error }) => {
          if (error) log.warn('Failed to update call outcome', { error: error.message });
        });
    }

    // 4. Load business for SMS + calendar
    const { data: biz } = await supabaseAdmin
      .from('businesses')
      .select('business_name, phone_number, owner_phone, timezone, pricing')
      .eq('id', req.businessId)
      .maybeSingle();

    let confirmationSent = false;
    if (biz) {
      const sid = await smsService.sendConfirmation({
        to:            req.customerPhone,
        customerName:  req.customerName ?? null,
        businessName:  biz.business_name as string,
        scheduledTime: req.scheduledTime,
        serviceType:   req.serviceType ?? null,
        timezone:      biz.timezone as string,
        language:      req.language,
        businessId:    req.businessId,
        customerId:    customer.id,
        appointmentId: appointment.id,
      });
      confirmationSent = !!sid;

      // Also notify the business owner
      const ownerPhone = biz.owner_phone as string | null;
      if (ownerPhone) {
        const ownerMsg =
          `New booking! ${req.customerName ?? req.customerPhone} — ` +
          `${req.serviceType ?? 'Service'} — ` +
          new Intl.DateTimeFormat('en-US', {
            timeZone: biz.timezone as string,
            weekday: 'short', month: 'short', day: 'numeric',
            hour: 'numeric', minute: '2-digit', hour12: true,
          }).format(req.scheduledTime);

        await smsService.send({
          to:          ownerPhone,
          body:        ownerMsg,
          businessId:  req.businessId,
          messageType: 'confirmation',
        });
      }
    }

    // 5. Google Calendar event
    let calendarEventId: string | undefined;
    if (biz) {
      const eventId = await calendarService.createEvent({
        businessId:      req.businessId,
        summary:         `${req.serviceType ?? 'Service'} — ${req.customerName ?? req.customerPhone}`,
        description:     req.issueDescription,
        startTime:       req.scheduledTime,
        durationMinutes: req.durationMinutes ?? 60,
        attendeeEmail:   req.customerEmail,
        timezone:        biz.timezone as string,
      });

      if (eventId) {
        calendarEventId = eventId;
        await supabaseAdmin
          .from('appointments')
          .update({ google_calendar_event_id: eventId })
          .eq('id', appointment.id)
          .then(({ error }) => {
            if (error) log.warn('Failed to save calendar event id', { error: error.message });
          });
      }
    }

    log.info('Booking created', {
      appointmentId:  appointment.id,
      customerId:     customer.id,
      confirmationSent,
      calendarEventId,
    });

    return {
      appointmentId:   appointment.id,
      customerId:      customer.id,
      scheduledTime:   req.scheduledTime,
      confirmationSent,
      calendarEventId,
    };
  }

  /** Cancel an appointment and update Google Calendar. */
  async cancel(appointmentId: string, businessId: string): Promise<void> {
    const appt = await appointmentRepo.findById(appointmentId);
    if (!appt || appt.business_id !== businessId) return;

    await appointmentRepo.updateStatus(appointmentId, 'cancelled');

    if (appt.google_calendar_event_id) {
      await calendarService.deleteEvent(businessId, appt.google_calendar_event_id);
    }

    log.info('Appointment cancelled', { appointmentId });
  }

  /** Complete a job and trigger follow-up workflows. */
  async complete(
    appointmentId: string,
    businessId: string,
    data: { actualCost?: number; completionNotes?: string; partsUsed?: unknown[] }
  ): Promise<void> {
    const appt = await appointmentRepo.findById(appointmentId);
    if (!appt || appt.business_id !== businessId) return;

    await appointmentRepo.complete(appointmentId, data);

    // Increment customer lifetime value
    if (appt.customer_id && data.actualCost) {
      await customerRepo.incrementJobCount(appt.customer_id, data.actualCost);
    }

    log.info('Appointment completed', { appointmentId, actualCost: data.actualCost });
  }
}
