import { Router } from 'express';
import { seasonsController } from './seasons.controller';

const router = Router();

/**
 * See: http://localhost:5444/docs/#/Seasons/get_seasons
 */
router.get('/seasons', seasonsController);

export default router;
