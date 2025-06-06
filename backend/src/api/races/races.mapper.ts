import { Race as ApiRace, Driver as ApiDriver } from '@f1/types/api-schemas';
import {
  Driver as PrismaDriver,
  Season as PrismaSeason,
} from '@prisma/client';
import { PrismaRaceWithDriver } from './types';



export function mapDriver(
  prismaDriver: PrismaDriver,
  seasonChampionId: number | null
): ApiDriver {
  return {
    id: prismaDriver.driverId, // use the string driverId as “id”
    givenName: prismaDriver.givenName,
    familyName: prismaDriver.familyName,
    isSeasonChampion: prismaDriver.id === seasonChampionId,
  };
}

export function mapRace(
  prismaRace: PrismaRaceWithDriver,
  season: PrismaSeason
): ApiRace {
  if (!prismaRace.result) {
    throw new Error(`Race id=${prismaRace.id} has no result.`);
  }
  return {
    id: prismaRace.id,
    name: prismaRace.raceName,
    date: prismaRace.date.toISOString(),
    season: season.year,
    driver: mapDriver(prismaRace.result.driver, season.championId),
  };
}
