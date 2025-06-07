import { SeasonWithChampion } from './types';
import prisma from '@f1/prismaInstance';

export const findAllSeasons = async (
  order: 'asc' | 'desc' = 'desc'
): Promise<SeasonWithChampion[]> => {
  return prisma.season.findMany({
    include: {
      champion: true,
    },
    orderBy: { year: order },
  });
};
