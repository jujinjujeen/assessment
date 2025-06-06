import { it, expect, Mock, beforeEach, vi } from 'vitest';
import prisma from '@f1/prismaInstance';

import {
  upsertDriver,
  upsertSeason,
  bulkInsertDrivers,
  upsertRace,
  findDriverById,
  upsertResult,
} from '@f1/be/service/ergast/ergast.repo';
import type {
  Driver as DriverDTO,
  Season as SeasonDTO,
  Race as RaceDTO,
  Result as ResultDTO,
} from '@f1/be/service/ergast/types';

import type {
  Driver as PrismaDriver,
  Season as PrismaSeason,
  Race as PrismaRace,
  Result as PrismaResult,
} from '@prisma/client';
import { describe } from 'node:test';

describe('Ergast Repository Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('upsertDriver()', () => {
    it('calls prisma.driver.upsert with the correct arguments and returns its result', async () => {
      const input: DriverDTO = {
        driverId: 'driver123',
        givenName: 'John',
        familyName: 'Doe',
      };
      const fakePrismaResponse: PrismaDriver = {
        id: 1,
        ...input,
      };

      // Mock prisma.driver.upsert to resolve with fakePrismaResponse
      (prisma.driver.upsert as Mock).mockResolvedValue(fakePrismaResponse);

      const result = await upsertDriver(input);

      // Verify return value
      expect(result).toEqual(fakePrismaResponse);

      // Verify prisma.driver.upsert was called exactly once with the right shape
      expect(prisma.driver.upsert).toHaveBeenCalledOnce();
      expect(prisma.driver.upsert).toHaveBeenCalledWith({
        where: { driverId: 'driver123' },
        update: {
          givenName: 'John',
          familyName: 'Doe',
        },
        create: {
          driverId: 'driver123',
          givenName: 'John',
          familyName: 'Doe',
        },
      });
    });
  });

  describe('upsertSeason()', () => {
    it('calls prisma.season.upsert to connect champion correctly and returns its result', async () => {
      const inputSeason: SeasonDTO = {
        year: 2023,
        url: 'https://example.com/2023',
      } as SeasonDTO;
      const fakeDriver: PrismaDriver = {
        id: 1,
        driverId: 'driver123',
        givenName: 'John',
        familyName: 'Doe',
      };
      const fakePrismaSeason: PrismaSeason = {
        id: 10,
        year: 2023,
        wikiUrl: 'https://example.com/2023',
        championId: 1,
      };

      (prisma.season.upsert as Mock).mockResolvedValue(fakePrismaSeason);

      const result = await upsertSeason(inputSeason, fakeDriver);

      expect(result).toEqual(fakePrismaSeason);

      expect(prisma.season.upsert).toHaveBeenCalledOnce();
      expect(prisma.season.upsert).toHaveBeenCalledWith({
        where: { year: 2023 },
        update: {
          wikiUrl: 'https://example.com/2023',
          champion: { connect: { id: 1 } },
        },
        create: {
          year: 2023,
          wikiUrl: 'https://example.com/2023',
          champion: { connect: { id: 1 } },
        },
      });
    });
  });

  describe('bulkInsertDrivers()', () => {
    it('calls prisma.driver.createMany with skipDuplicates and returns the count', async () => {
      const drivers: DriverDTO[] = [
        { driverId: 'd1', givenName: 'Alice', familyName: 'Anderson' },
        { driverId: 'd2', givenName: 'Bob', familyName: 'Brown' },
      ];
      const fakeResponse = { count: 2 };

      (prisma.driver.createMany as Mock).mockResolvedValue(fakeResponse);

      const result = await bulkInsertDrivers(drivers);

      expect(result).toEqual(fakeResponse);

      expect(prisma.driver.createMany).toHaveBeenCalledOnce();
      expect(prisma.driver.createMany).toHaveBeenCalledWith({
        data: drivers,
        skipDuplicates: true,
      });
    });
  });

  describe('upsertRace()', () => {
    it('calls prisma.race.upsert with correct where/create and returns its result', async () => {
      const inputRace: RaceDTO = {
        raceName: 'Australian Grand Prix',
        date: '2023-03-25T00:00:00Z',
      } as RaceDTO;
      const fakeSeason: PrismaSeason = {
        id: 5,
        year: 2023,
        wikiUrl: 'https://example.com/2023',
        championId: 1,
      };
      const fakePrismaRace: PrismaRace = {
        id: 100,
        raceName: 'Australian Grand Prix',
        date: new Date('2023-03-25T00:00:00Z'),
        seasonId: 5,
      };

      (prisma.race.upsert as Mock).mockResolvedValue(fakePrismaRace);

      const result = await upsertRace(inputRace, fakeSeason);

      expect(result).toEqual(fakePrismaRace);

      expect(prisma.race.upsert).toHaveBeenCalledOnce();
      expect(prisma.race.upsert).toHaveBeenCalledWith({
        where: {
          raceName_seasonId: {
            raceName: 'Australian Grand Prix',
            seasonId: 5,
          },
        },
        update: {},
        create: {
          raceName: 'Australian Grand Prix',
          date: new Date('2023-03-25T00:00:00Z'),
          season: { connect: { id: 5 } },
        },
      });
    });
  });

  describe('findDriverById()', () => {
    it('calls prisma.driver.findUnique and returns the driver when found', async () => {
      const fakeDriver: PrismaDriver = {
        id: 2,
        driverId: 'driver456',
        givenName: 'Charlie',
        familyName: 'Chaplin',
      };

      (prisma.driver.findUnique as Mock).mockResolvedValue(fakeDriver);

      const result = await findDriverById('driver456');

      expect(result).toEqual(fakeDriver);

      expect(prisma.driver.findUnique).toHaveBeenCalledOnce();
      expect(prisma.driver.findUnique).toHaveBeenCalledWith({
        where: { driverId: 'driver456' },
      });
    });

    it('returns null if prisma returns null', async () => {
      (prisma.driver.findUnique as Mock).mockResolvedValue(null);

      const result = await findDriverById('nonexistent');

      expect(result).toBeNull();
      expect(prisma.driver.findUnique).toHaveBeenCalledOnce();
      expect(prisma.driver.findUnique).toHaveBeenCalledWith({
        where: { driverId: 'nonexistent' },
      });
    });
  });

  describe('upsertResult()', () => {
    it('calls prisma.result.upsert with correct where/update/create', async () => {
      const fakeRace: PrismaRace = {
        id: 50,
        raceName: 'Monaco GP',
        date: new Date('2023-05-28T00:00:00Z'),
        seasonId: 2023,
      };
      const fakeDriver: PrismaDriver = {
        id: 2,
        driverId: 'd2',
        givenName: 'Bob',
        familyName: 'Brown',
      };
      const inputResult: ResultDTO = { position: 1 } as ResultDTO;
      const fakePrismaResult: PrismaResult = {
        id: 500,
        raceId: 50,
        driverId: 2,
        position: 1,
      };

      (prisma.result.upsert as Mock).mockResolvedValue(fakePrismaResult);

      const result = await upsertResult(fakeRace, fakeDriver, inputResult);

      expect(result).toEqual(fakePrismaResult);

      expect(prisma.result.upsert).toHaveBeenCalledOnce();
      expect(prisma.result.upsert).toHaveBeenCalledWith({
        where: { raceId: 50 },
        update: {
          position: 1,
          driver: { connect: { id: 2 } },
        },
        create: {
          position: 1,
          driver: { connect: { id: 2 } },
          race: { connect: { id: 50 } },
        },
      });
    });
  });
});
