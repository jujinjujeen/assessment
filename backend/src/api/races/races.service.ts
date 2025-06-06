import { mapRace } from './races.mapper';
import { Race as ApiRace } from '@f1/types/api-schemas';
import { findRacesBySeasonId, findSeasonByYear } from './races.repo';

export async function getRacesBySeasonYear(
  seasonYear: number
): Promise<ApiRace[]> {
  const season = await findSeasonByYear(seasonYear);
  if (!season) {
    return [];
  }

  const prismaRaces = await findRacesBySeasonId(season.id);

  return prismaRaces
    .map((r) => {
      // Ensure that result and driver exist
      if (!r.result || !r.result.driver) return null;
      return mapRace(r, season);
    })
    .filter((r): r is ApiRace => r !== null);
}
