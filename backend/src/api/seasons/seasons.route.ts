import { Router } from 'express';
import { seasonsController } from './seasons.controller';

const router = Router();

/**
 * See: http://localhost:5444/docs#/paths/~1health/get
 */
router.get('/seasons', seasonsController);

export default router;
