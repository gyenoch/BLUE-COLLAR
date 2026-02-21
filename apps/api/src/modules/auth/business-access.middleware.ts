import { Response, NextFunction } from 'express';
import { AuthService } from './auth.service';
import { AuthedRequest } from './types';
import { ForbiddenError, NotFoundError } from '../../utils/errors';

const authService = new AuthService();

/**
 * Must run after requireAuth.
 * Loads the business for req.auth.userId and attaches it to req.business.
 * Uses businessId from params, query, or body (in that order).
 */
export async function requireBusinessAccess(
  req: AuthedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { userId } = req.auth;
    const businessId =
      (req.params.businessId as string) ||
      (req.query.businessId as string) ||
      (req.body?.businessId as string);

    if (businessId) {
      const hasAccess = await authService.canAccessBusiness(userId, businessId);
      if (!hasAccess) {
        throw new ForbiddenError('Access denied to this business');
      }
    }

    const business = await authService.getUserBusiness(userId);
    if (!business) {
      throw new NotFoundError('Business profile (complete onboarding first)');
    }

    req.business = business;
    next();
  } catch (err) {
    next(err);
  }
}
