/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRacesBySeasonYear } from '../races.service';
import { findRacesBySeasonId, findSeasonByYear } from '../races.repo';
import { mapRace } from '../races.mapper';
import { Season as PrismaSeason } from '@prisma/client';
import { PrismaRaceWithDriver } from '../types';
import { Race as ApiRace } from '@f1/types/api-schemas';

vi.mock('../races.repo', () => ({
  findSeasonByYear: vi.fn(),
  findRacesBySeasonId: vi.fn(),
}));

vi.mock('../races.mapper', () => ({
  mapRace: vi.fn(),
}));

describe('races.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRacesBySeasonYear', () => {
    const mockSeason: PrismaSeason = {
      id: 1,
      year: 2023,
      championId: 1,
    } as PrismaSeason;

    const mockValidRace: PrismaRaceWithDriver = {
      id: 1,
      raceName: 'Bahrain Grand Prix',
      date: new Date('2023-03-05'),
      seasonId: 1,
      result: {
        id: 1,
        raceId: 1,
        driverId: 1,
        position: 1,
        driver: {
          id: 1,
          driverId: 'hamilton',
          givenName: 'Lewis',
          familyName: 'Hamilton',
        },
      },
    };

    const mockApiRace: ApiRace = {
      id: 1,
      name: 'Bahrain Grand Prix',
      date: '2023-03-05T00:00:00.000Z',
      season: 2023,
      driver: {
        id: 'hamilton',
        givenName: 'Lewis',
        familyName: 'Hamilton',
        isSeasonChampion: true,
      },
    };

    it('should return mapped races when season and races exist', async () => {
      vi.mocked(findSeasonByYear).mockResolvedValue(mockSeason);
      vi.mocked(findRacesBySeasonId).mockResolvedValue([mockValidRace]);
      vi.mocked(mapRace).mockReturnValue(mockApiRace);

      const result = await getRacesBySeasonYear(2023);

      expect(findSeasonByYear).toHaveBeenCalledWith(2023);
      expect(findRacesBySeasonId).toHaveBeenCalledWith(1);
      expect(mapRace).toHaveBeenCalledWith(mockValidRace, mockSeason);
      expect(result).toEqual([mockApiRace]);
    });

    it('should return empty array when season not found', async () => {
      vi.mocked(findSeasonByYear).mockResolvedValue(null);

      const result = await getRacesBySeasonYear(2023);

      expect(findSeasonByYear).toHaveBeenCalledWith(2023);
      expect(findRacesBySeasonId).not.toHaveBeenCalled();
      expect(mapRace).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return empty array when no races found', async () => {
      vi.mocked(findSeasonByYear).mockResolvedValue(mockSeason);
      vi.mocked(findRacesBySeasonId).mockResolvedValue([]);

      const result = await getRacesBySeasonYear(2023);

      expect(findSeasonByYear).toHaveBeenCalledWith(2023);
      expect(findRacesBySeasonId).toHaveBeenCalledWith(1);
      expect(mapRace).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should filter out races with no result', async () => {
      const raceWithoutResult: PrismaRaceWithDriver = {
        ...mockValidRace,
        id: 2,
        result: null,
      };

      vi.mocked(findSeasonByYear).mockResolvedValue(mockSeason);
      vi.mocked(findRacesBySeasonId).mockResolvedValue([
        mockValidRace,
        raceWithoutResult,
      ]);
      vi.mocked(mapRace).mockReturnValue(mockApiRace);

      const result = await getRacesBySeasonYear(2023);

      expect(mapRace).toHaveBeenCalledTimes(1);
      expect(mapRace).toHaveBeenCalledWith(mockValidRace, mockSeason);
      expect(result).toEqual([mockApiRace]);
    });

    it('should filter out races with result but no driver', async () => {
      const raceWithoutDriver: PrismaRaceWithDriver = {
        ...mockValidRace,
        id: 2,
        result: {
          ...mockValidRace.result!,
          driver: null as any,
        },
      };

      vi.mocked(findSeasonByYear).mockResolvedValue(mockSeason);
      vi.mocked(findRacesBySeasonId).mockResolvedValue([
        mockValidRace,
        raceWithoutDriver,
      ]);
      vi.mocked(mapRace).mockReturnValue(mockApiRace);

      const result = await getRacesBySeasonYear(2023);

      expect(mapRace).toHaveBeenCalledTimes(1);
      expect(mapRace).toHaveBeenCalledWith(mockValidRace, mockSeason);
      expect(result).toEqual([mockApiRace]);
    });

    it('should process multiple valid races', async () => {
      const race2 = { ...mockValidRace, id: 2, raceName: 'Saudi GP' };
      const apiRace2 = { ...mockApiRace, id: 2, name: 'Saudi GP' };

      vi.mocked(findSeasonByYear).mockResolvedValue(mockSeason);
      vi.mocked(findRacesBySeasonId).mockResolvedValue([mockValidRace, race2]);
      vi.mocked(mapRace)
        .mockReturnValueOnce(mockApiRace)
        .mockReturnValueOnce(apiRace2);

      const result = await getRacesBySeasonYear(2023);

      expect(mapRace).toHaveBeenCalledTimes(2);
      expect(result).toEqual([mockApiRace, apiRace2]);
    });
  });
});
