import { Router } from 'express';
import { components } from "@f1/types/api";

export const router = Router();

/**
 * See: http://localhost:5444/docs#/paths/~1health/get
 */
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() } as components['schemas']['HealthResponse']);
});
