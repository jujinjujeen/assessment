import type { ErrorResponse, SeasonsResponse } from '@f1/types/api-schemas';
import { Request, Response } from 'express';
import { getAllSeasons } from './seasons.service';

export const seasonsController = async (
  _req: Request,
  res: Response<SeasonsResponse | ErrorResponse>
) => {
  try {
    const seasons: SeasonsResponse = await getAllSeasons();
    res.status(200).json(seasons);
  } catch (error) {
    console.error('Error fetching seasons:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  }
};
