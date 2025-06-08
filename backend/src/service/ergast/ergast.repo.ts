import {
  Driver as PrismaDriver,
  Season as PrismaSeason,
  Race as PrismaRace,
  Result as PrismaResult,
} from '@prisma/client';
import { Season, Driver, Result, Race } from './types';
import prisma from '@f1/prismaInstance';

export const upsertDriver = async (driver: Driver): Promise<PrismaDriver> => {
  return prisma.driver.upsert({
    where: { driverId: driver.driverId },
    update: {
      givenName: driver.givenName,
      familyName: driver.familyName,
    },
    create: {
      driverId: driver.driverId,
      givenName: driver.givenName,
      familyName: driver.familyName,
    },
  });
};

export const upsertSeason = async (
  season: Season,
  topDriver: PrismaDriver
): Promise<PrismaSeason> => {
  return prisma.season.upsert({
    where: { year: season.year },
    update: {
      wikiUrl: season.url,
      champion: { connect: { id: topDriver.id } },
    },
    create: {
      year: season.year,
      wikiUrl: season.url,
      champion: {
        connect: { id: topDriver.id },
      },
    },
  });
};

export const bulkInsertDrivers = async (
  drivers: Driver[]
): Promise<{ count: number }> => {
  return prisma.driver.createMany({
    data: drivers,
    skipDuplicates: true,
  });
};

export const upsertRace = async (
  race: Race,
  season: PrismaSeason
): Promise<PrismaRace> => {
  return await prisma.race.upsert({
    where: {
      raceName_seasonId: {
        raceName: race.raceName,
        seasonId: season.id,
      },
    },
    update: {},
    create: {
      raceName: race.raceName,
      date: new Date(race.date),
      season: { connect: { id: season.id } },
    },
  });
};

export const findDriverById = async (
  driverId: string
): Promise<PrismaDriver | null> => {
  return prisma.driver.findUnique({
    where: { driverId: driverId },
  });
};

export const upsertResult = async (
  race: PrismaRace,
  driver: PrismaDriver,
  result: Result
): Promise<PrismaResult> => {
  return prisma.result.upsert({
    where: {
      raceId: race.id,
    },
    update: {
      position: result.position,
      driver: { connect: { id: driver.id } },
    },
    create: {
      position: result.position,
      driver: { connect: { id: driver.id } },
      race: { connect: { id: race.id } },
    },
  });
};
