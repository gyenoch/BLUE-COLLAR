import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthedRequest } from '../auth/types';
import { BookingService } from './booking.service';
import { AvailabilityService } from './availability.service';
import { AppointmentRepository } from '../../database/repositories/appointment.repository';
import { ValidationError } from '../../utils/errors';

const bookingService      = new BookingService();
const availabilityService = new AvailabilityService();
const appointmentRepo     = new AppointmentRepository();

const bookingSchema = z.object({
  customerPhone:    z.string().min(10),
  customerName:     z.string().optional(),
  customerEmail:    z.string().email().optional(),
  callId:           z.string().uuid().optional(),
  scheduledTime:    z.string().datetime(),
  serviceType:      z.string().optional(),
  issueDescription: z.string().optional(),
  urgency:          z.enum(['emergency', 'urgent', 'routine']).optional(),
  estimatedCostMin: z.number().positive().optional(),
  estimatedCostMax: z.number().positive().optional(),
  durationMinutes:  z.number().int().min(15).max(480).optional(),
  language:         z.enum(['en', 'es']).optional(),
});

export class BookingController {
  /** POST /api/bookings */
  async create(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = bookingSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid request');
      }

      const result = await bookingService.book({
        businessId:    req.business!.id,
        ...parsed.data,
        scheduledTime: new Date(parsed.data.scheduledTime),
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/bookings */
  async list(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const status = req.query.status as string | undefined;
      const limit  = Math.min(parseInt(req.query.limit as string ?? '50', 10), 100);
      const offset = parseInt(req.query.offset as string ?? '0', 10);

      const appointments = await appointmentRepo.findAllByBusiness(
        req.business!.id,
        status,
        limit,
        offset
      );

      res.json({ data: appointments, limit, offset });
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/bookings/upcoming */
  async upcoming(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const appointments = await appointmentRepo.findUpcoming(req.business!.id);
      res.json({ data: appointments });
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/bookings/availability */
  async availability(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const date = req.query.date as string;
      if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new ValidationError('Query param ?date=YYYY-MM-DD is required');
      }

      const duration = parseInt(req.query.duration as string ?? '60', 10);
      const window = await availabilityService.getAvailableSlots({
        businessId:      req.business!.id,
        date,
        durationMinutes: duration,
      });

      res.json(window);
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/bookings/available-dates */
  async availableDates(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const count = parseInt(req.query.count as string ?? '5', 10);
      const dates = await availabilityService.getNextAvailableDates(req.business!.id, count);
      res.json({ dates });
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/bookings/:id */
  async getOne(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const appt = await appointmentRepo.findById(req.params.id);
      if (!appt || appt.business_id !== req.business!.id) {
        res.status(404).json({ error: 'Appointment not found' });
        return;
      }
      res.json(appt);
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /api/bookings/:id/cancel */
  async cancel(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      await bookingService.cancel(req.params.id, req.business!.id);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /api/bookings/:id/complete */
  async complete(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { actualCost, completionNotes, partsUsed } = req.body as {
        actualCost?: number;
        completionNotes?: string;
        partsUsed?: unknown[];
      };

      await bookingService.complete(req.params.id, req.business!.id, {
        actualCost,
        completionNotes,
        partsUsed,
      });

      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }
}
