import type { ErrorResponse, SeasonsResponse } from '@f1/types/api-schemas';
import { Request, Response } from 'express';
import { getAllSeasons } from './seasons.service';

export const seasonsController = async (
  _req: Request,
  res: Response<SeasonsResponse | ErrorResponse>
) => {
  const seasons: SeasonsResponse = await getAllSeasons();
  res.status(200).json(seasons);
  return;
};
