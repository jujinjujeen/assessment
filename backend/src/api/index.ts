import { Router } from 'express';
import healthRouter from './health/health.route';
import seasonsRouter from './seasons/seasons.route';
import racesRouter from './races/races.route';

export const router = Router();

router.use(healthRouter);
router.use(seasonsRouter);
router.use(racesRouter);
