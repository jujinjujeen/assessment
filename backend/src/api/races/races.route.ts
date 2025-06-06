import { Router } from 'express';
import { racesController } from './races.controller';

const router = Router();

router.get('/seasons/:seasonId/races', racesController);

export default router;