import prisma from '@f1/prismaInstance';
import { Season as PrismaSeason } from '@prisma/client';
import { PrismaRaceWithDriver } from './types';

export const findSeasonByYear = async (
  year: number
): Promise<PrismaSeason | null> => {
  return prisma.season.findUnique({
    where: { year },
  });
};

export const findRacesBySeasonId = async (
  seasonId: number
): Promise<PrismaRaceWithDriver[]> => {
  return prisma.race.findMany({
    where: { seasonId: seasonId },
    include: {
      result: {
        include: {
          driver: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });
};
