import { Router } from 'express';
import { healthController } from './health.controller';

const router = Router();

/**
 * See: http://localhost:5444/docs#/paths/~1health/get
 */
router.get('/health', healthController);

export default router;
