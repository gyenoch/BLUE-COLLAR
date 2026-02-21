import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthedRequest } from '../auth/types';
import { CustomersService } from './customers.service';
import { ValidationError, NotFoundError } from '../../utils/errors';

const service = new CustomersService();

const updateSchema = z.object({
  name:             z.string().min(1).optional(),
  email:            z.string().email().optional(),
  address:          z.string().optional(),
  city:             z.string().optional(),
  state:            z.string().length(2).optional(),
  zip:              z.string().optional(),
  language:         z.enum(['en', 'es']).optional(),
  preferredContact: z.enum(['phone', 'sms', 'email']).optional(),
  internalNotes:    z.string().optional(),
  tags:             z.array(z.string()).optional(),
});

export class CustomersController {
  /** GET /api/customers */
  async list(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit  = Math.min(parseInt(req.query.limit  as string ?? '50', 10), 100);
      const offset = parseInt(req.query.offset as string ?? '0', 10);
      const search = req.query.search as string | undefined;

      if (search && search.length >= 2) {
        const results = await service.search(req.business!.id, search);
        res.json({ data: results, limit, offset });
        return;
      }

      const customers = await service.list(req.business!.id, { limit, offset });
      res.json({ data: customers, limit, offset });
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/customers/:id */
  async getOne(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const detail = await service.getDetail(req.params.id, req.business!.id);
      if (!detail) throw new NotFoundError('Customer');
      res.json(detail);
    } catch (err) {
      next(err);
    }
  }

  /** PATCH /api/customers/:id */
  async update(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const parsed = updateSchema.safeParse(req.body);
      if (!parsed.success) {
        throw new ValidationError(parsed.error.issues[0]?.message ?? 'Invalid request');
      }

      await service.update(req.params.id, req.business!.id, parsed.data);
      res.json({ success: true });
    } catch (err) {
      next(err);
    }
  }

  /** GET /api/customers/top */
  async top(req: AuthedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string ?? '5', 10);
      const customers = await service.getTopCustomers(req.business!.id, limit);
      res.json({ data: customers });
    } catch (err) {
      next(err);
    }
  }
}
