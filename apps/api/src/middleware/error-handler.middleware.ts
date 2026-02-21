import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { ZodError } from 'zod';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Known operational errors
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error('Operational error', { message: err.message, stack: err.stack });
    }
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  // Unknown errors — log fully and return generic 500
  logger.error('Unhandled error', { message: err.message, stack: err.stack });
  res.status(500).json({ error: 'Internal server error' });
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Route not found' });
}
