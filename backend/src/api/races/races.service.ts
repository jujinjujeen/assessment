import prisma from '@f1/prismaInstance';
import { mapRace } from './races.mapper';
import { Race as ApiRace } from '@f1/types/api-schemas';

export async function getRacesBySeasonYear(
  seasonYear: number
): Promise<ApiRace[]> {
  const season = await prisma.season.findUnique({
    where: { year: seasonYear },
  });
  if (!season) {
    return [];
  }

  const prismaRaces = await prisma.race.findMany({
    where: { seasonId: season.id },
    include: {
      result: {
        include: {
          driver: true,
        },
      },
    },
    orderBy: { date: 'desc' },
  });

  return prismaRaces
    .map((r) => {
      // Ensure that result and driver exist
      if (!r.result || !r.result.driver) return null;
      return mapRace(r, season);
    })
    .filter((r): r is ApiRace => r !== null);
}
