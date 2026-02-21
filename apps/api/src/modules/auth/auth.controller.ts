import { Router, Response, NextFunction } from 'express';
import { AuthedRequest } from './types';
import { AuthService } from './auth.service';
import { requireAuth } from './auth.middleware';
import { requireBusinessAccess } from './business-access.middleware';

const authService = new AuthService();

export class AuthController {
  /** GET /auth/me — returns the current user's business profile */
  async getMe(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const business = await authService.getUserBusiness(req.auth.userId);
      res.json({ userId: req.auth.userId, business });
    } catch (err) {
      next(err);
    }
  }
}

const controller = new AuthController();
const router = Router();

router.get('/me', requireAuth as any, requireBusinessAccess as any, (req, res, next) => controller.getMe.call(controller, req as any, res, next));

export default router;
