import { Router } from 'express';
import { racesController } from './races.controller';
import { validateRequest } from '@f1/be/middleware/validateRequest';
import { SeasonIdParamSchema } from './races.schema';

const router = Router();

router.get(
  '/seasons/:seasonId/races',
  validateRequest(SeasonIdParamSchema, 'params'),
  racesController
);

export default router;
