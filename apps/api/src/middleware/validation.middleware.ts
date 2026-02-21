import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

type Target = 'body' | 'params' | 'query';

/**
 * Validate a request field against a Zod schema.
 * Attaches the parsed (coerced) value back to req[target].
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    (req as any)[target] = result.data;
    next();
  };
}
