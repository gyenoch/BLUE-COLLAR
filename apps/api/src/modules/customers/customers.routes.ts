import { Router } from 'express';
import { CustomersController } from './customers.controller';
import { requireAuth } from '../auth/auth.middleware';
import { requireBusinessAccess } from '../auth/business-access.middleware';
import { apiLimiter } from '../../middleware/rate-limiter.middleware';

const router = Router();
const controller = new CustomersController();

router.use(requireAuth as any);
router.use(requireBusinessAccess as any);
router.use(apiLimiter);

router.get('/',      (req, res, next) => controller.list.call(controller, req as any, res, next));
router.get('/top',   (req, res, next) => controller.top.call(controller, req as any, res, next));
router.get('/:id',   (req, res, next) => controller.getOne.call(controller, req as any, res, next));
router.patch('/:id', (req, res, next) => controller.update.call(controller, req as any, res, next));

export default router;
