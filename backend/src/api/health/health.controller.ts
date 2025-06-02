import { Request, Response } from 'express';
import type { HealthResponse } from '@f1/types/api-schemas';

export const healthController = (
  _req: Request,
  res: Response<HealthResponse>
) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
};
