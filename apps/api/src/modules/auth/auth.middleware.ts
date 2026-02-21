import { Request, Response, NextFunction } from 'express';
import { clerkClient } from '../../config/clerk.config';
import { UnauthorizedError } from '../../utils/errors';
import { AuthedRequest } from './types';
import { createLogger } from '../../utils/logger';

const log = createLogger('auth-middleware');

/**
 * Verifies the Bearer token from Authorization header using Clerk.
 * Attaches req.auth.userId on success.
 */
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing Bearer token');
    }

    const token = authHeader.slice(7);
    const { sub: userId } = await clerkClient.verifyToken(token);

    (req as AuthedRequest).auth = { userId };
    next();
  } catch (err) {
    log.warn('Auth failed', { error: (err as Error).message });
    next(new UnauthorizedError());
  }
}
