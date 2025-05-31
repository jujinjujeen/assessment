import { Router } from 'express';

export const router = Router();

// Healthcheck
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

// Feature routes
// router.use('/auth', authRoutes);