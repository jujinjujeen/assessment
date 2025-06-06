/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect } from 'vitest';
import { mapDriver, mapRace } from '../races.mapper';
import { Driver as PrismaDriver, Season as PrismaSeason } from '@prisma/client';
import { PrismaRaceWithDriver } from '../types';

describe('races.mapper', () => {
  describe('mapDriver', () => {
    const mockPrismaDriver: PrismaDriver = {
      id: 1,
      driverId: 'hamilton',
      givenName: 'Lewis',
      familyName: 'Hamilton',
    };

    it('should map PrismaDriver to ApiDriver correctly', () => {
      const result = mapDriver(mockPrismaDriver, null);

      expect(result).toEqual({
        id: 'hamilton',
        givenName: 'Lewis',
        familyName: 'Hamilton',
        isSeasonChampion: false,
      });
    });

    it('should set isSeasonChampion to true when driver id matches seasonChampionId', () => {
      const result = mapDriver(mockPrismaDriver, 1);

      expect(result.isSeasonChampion).toBe(true);
    });

    it('should set isSeasonChampion to false when driver id does not match seasonChampionId', () => {
      const result = mapDriver(mockPrismaDriver, 2);

      expect(result.isSeasonChampion).toBe(false);
    });

    it('should set isSeasonChampion to false when seasonChampionId is null', () => {
      const result = mapDriver(mockPrismaDriver, null);

      expect(result.isSeasonChampion).toBe(false);
    });
  });

  describe('mapRace', () => {
    const mockSeason: PrismaSeason = {
      id: 1,
      year: 2023,
      championId: 1,
    } as PrismaSeason;

    const mockPrismaDriver: PrismaDriver = {
      id: 1,
      driverId: 'hamilton',
      givenName: 'Lewis',
      familyName: 'Hamilton',
    } as PrismaDriver;

    const mockRaceDate = new Date('2023-03-05T15:00:00Z');

    const mockPrismaRaceWithDriver: PrismaRaceWithDriver = {
      id: 1,
      raceName: 'Bahrain Grand Prix',
      date: mockRaceDate,
      seasonId: 1,

      result: {
        id: 1,
        raceId: 1,
        driverId: 1,
        position: 1,
        driver: mockPrismaDriver,
      },
    };

    it('should map PrismaRaceWithDriver to ApiRace correctly', () => {
      const result = mapRace(mockPrismaRaceWithDriver, mockSeason);

      expect(result).toEqual({
        id: 1,
        name: 'Bahrain Grand Prix',
        date: mockRaceDate.toISOString(),
        season: 2023,
        driver: {
          id: 'hamilton',
          givenName: 'Lewis',
          familyName: 'Hamilton',
          isSeasonChampion: true,
        },
      });
    });

    it('should throw error when race has no result', () => {
      const raceWithoutResult: PrismaRaceWithDriver = {
        ...mockPrismaRaceWithDriver,
        result: null,
      };

      expect(() => mapRace(raceWithoutResult, mockSeason)).toThrow(
        'Race id=1 has no result.'
      );
    });

    it('should throw error when race result is undefined', () => {
      const raceWithUndefinedResult: PrismaRaceWithDriver = {
        ...mockPrismaRaceWithDriver,
        result: undefined as any,
      };

      expect(() => mapRace(raceWithUndefinedResult, mockSeason)).toThrow(
        'Race id=1 has no result.'
      );
    });

    it('should correctly identify season champion', () => {
      const result = mapRace(mockPrismaRaceWithDriver, mockSeason);

      expect(result.driver.isSeasonChampion).toBe(true);
    });

    it('should correctly identify non-champion driver', () => {
      const nonChampionSeason: PrismaSeason = {
        ...mockSeason,
        championId: 2, // Different driver ID
      };

      const result = mapRace(mockPrismaRaceWithDriver, nonChampionSeason);

      expect(result.driver.isSeasonChampion).toBe(false);
    });

    it('should format date as ISO string', () => {
      const result = mapRace(mockPrismaRaceWithDriver, mockSeason);

      expect(result.date).toBe(mockRaceDate.toISOString());
      expect(typeof result.date).toBe('string');
    });
  });
});
