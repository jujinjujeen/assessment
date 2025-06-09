import { Request, Response } from 'express';
import { ErrorResponse, RacesResponse } from '@f1/types/api-schemas';
import { getRacesBySeasonYear } from './races.service';
import { HTTP_LABEL, HTTP_STATUS } from '@f1/be/constants';

export const racesController = async (
  req: Request<{ seasonId: string }>,
  res: Response<RacesResponse | ErrorResponse>
) => {
  const { seasonId } = req.params;
  const parsedSeasonId = parseInt(seasonId, 10);

  const races = await getRacesBySeasonYear(parsedSeasonId);
  if (races.length === 0) {
    res.status(HTTP_STATUS.NOT_FOUND).json({
      error: HTTP_LABEL.NOT_FOUND,
      message: `Season with year ${seasonId} not found or has no races.`,
      code: HTTP_STATUS.NOT_FOUND,
    });
    return;
  }
  res.status(HTTP_STATUS.OK).json(races);
  return;
};
