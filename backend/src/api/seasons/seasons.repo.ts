import { Season as PrismaSeason } from '@prisma/client';
import prisma from '@f1/prismaInstance';

export const findAllSeasons = async (order: 'asc' | 'desc' = 'desc'): Promise<PrismaSeason[]> => {
  return prisma.season.findMany({
    orderBy: { year: order },
  });
};
