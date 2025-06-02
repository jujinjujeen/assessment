import { Request, Response } from 'express';

export const seasonsController = (_req: Request, res: Response) => {
  res.status(200).json({
    seasons: [
      {
        id: '2023',
        name: '2023 Formula 1 Season',
        startDate: '2023-03-05',
        endDate: '2023-11-26',
      },
      {
        id: '2024',
        name: '2024 Formula 1 Season',
        startDate: '2024-03-03',
        endDate: '2024-11-24',
      },
    ],
  });
};
