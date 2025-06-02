import { Request, Response, NextFunction } from 'express';

/**
 * A utility function to catch errors in async Express route handlers.
 * It wraps the handler function and catches any errors, passing them to the next middleware.
 *
 * @param fn - The async function to wrap.
 * @returns A new function that catches errors and passes them to the next middleware.
 */
export const catchAsync =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);
