import { Router } from 'express';
import { VoiceController } from './voice.controller';
import { requireAuth } from '../auth/auth.middleware';
import { requireBusinessAccess } from '../auth/business-access.middleware';
import { webhookLimiter } from '../../middleware/rate-limiter.middleware';

const router = Router();
const controller = new VoiceController();

// Twilio webhook — no auth needed, but Twilio signature validated separately
router.post('/incoming', webhookLimiter, (req, res, next) => controller.handleIncomingCall.call(controller, req, res, next));

// Protected dashboard routes
router.get('/calls', requireAuth as any, requireBusinessAccess as any, (req, res, next) => controller.getCalls.call(controller, req as any, res, next));
router.get('/calls/:callSid', requireAuth as any, requireBusinessAccess as any, (req, res, next) => controller.getCall.call(controller, req as any, res, next));

export default router;
