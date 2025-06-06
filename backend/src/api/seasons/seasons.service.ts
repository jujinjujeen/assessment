import { Season } from '@f1/types/api-schemas';
import prisma from '@f1/prismaInstance';
import { mapSeason } from './seasons.mapper';

export const getAllSeasons = async (): Promise<Season[]> => {
  const seasonsDb = await prisma.season.findMany({
    orderBy: { year: 'desc' },
  });

  return seasonsDb.map(mapSeason);
};
