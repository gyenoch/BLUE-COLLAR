import { Router } from 'express';
import { BookingController } from './booking.controller';
import { requireAuth } from '../auth/auth.middleware';
import { requireBusinessAccess } from '../auth/business-access.middleware';
import { apiLimiter } from '../../middleware/rate-limiter.middleware';

const router = Router();
const controller = new BookingController();

// All booking routes require auth + business context
router.use(requireAuth as any);
router.use(requireBusinessAccess as any);
router.use(apiLimiter);

// Availability
router.get('/availability',    (req, res, next) => controller.availability.call(controller, req as any, res, next));
router.get('/available-dates', (req, res, next) => controller.availableDates.call(controller, req as any, res, next));

// Appointments
router.get('/',          (req, res, next) => controller.list.call(controller, req as any, res, next));
router.get('/upcoming',  (req, res, next) => controller.upcoming.call(controller, req as any, res, next));
router.post('/',         (req, res, next) => controller.create.call(controller, req as any, res, next));
router.get('/:id',       (req, res, next) => controller.getOne.call(controller, req as any, res, next));
router.patch('/:id/cancel',   (req, res, next) => controller.cancel.call(controller, req as any, res, next));
router.patch('/:id/complete', (req, res, next) => controller.complete.call(controller, req as any, res, next));

export default router;
