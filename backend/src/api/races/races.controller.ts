import { Request, Response } from 'express';
import { ErrorResponse, RacesResponse } from '@f1/types/api-schemas';
import { getRacesBySeasonYear } from './races.service';

export const racesController = async (
  req: Request<{ seasonId: string }>,
  res: Response<RacesResponse | ErrorResponse>
) => {
  const { seasonId } = req.params;
  const parsedYear = parseInt(seasonId || '', 10);
  const currentYear = new Date().getFullYear();

  if (isNaN(parsedYear) || parsedYear < 2005 || parsedYear > currentYear) {
    res.status(400).json({
      error: 'Bad Request',
      message: `seasonId must be an integer between 2005 and ${currentYear} (got: "${seasonId}")`,
      code: 400,
    });
  }

  try {
    const races = await getRacesBySeasonYear(parsedYear);
    if (races.length === 0) {
      res.status(404).json({
        error: 'Not Found',
        message: `Season with year ${parsedYear} not found or has no races.`,
        code: 404,
      });
    }
    res.status(200).json(races);
  } catch (err) {
    console.error('DB error fetching races for season:', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch races from the database',
      code: 500,
    });
  }
};
