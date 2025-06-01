import { components } from '@f1/types/api';
import { Request, Response } from 'express';

type HealthResponse = components['schemas']['HealthResponse'];

export const healthController = (
  _req: Request,
  res: Response<HealthResponse>
) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
};
