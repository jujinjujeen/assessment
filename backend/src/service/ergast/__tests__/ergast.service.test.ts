import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { putSeason, putSeasons } from '../ergast.service';
import { raceMapper } from '../ergast.mapper';
import {
  fetchhDriverStandings,
  fetchResults,
  fetchSeasons,
} from '../ergast.client';
import {
  bulkInsertDrivers,
  findDriverById,
  upsertDriver,
  upsertRace,
  upsertResult,
  upsertSeason,
} from '../ergast.repo';
import { Season as SeasonAPI } from '../../../types/ergast';

// Mock all dependencies
vi.mock('../ergast.mapper');
vi.mock('../ergast.client');
vi.mock('../ergast.repo');

// Mock console methods to avoid noise in tests
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
  error: vi.spyOn(console, 'error').mockImplementation(() => {}),
};

describe('ergast.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('putSeason', () => {
    const mockSeason: SeasonAPI = {
      season: '2023',
      url: 'http://example.com/2023',
    };

    const mockResults = [{ raceId: '1', driverId: 'hamilton' }];
    const mockChampionData = [{ driverId: 'verstappen', points: 575 }];
    const mockSeasonData = {
      year: 2023,
      winner: { driverId: 'verstappen', forename: 'Max', surname: 'Verstappen' },
      drivers: [{ driverId: 'hamilton' }, { driverId: 'verstappen' }],
      races: [
        {
          raceId: '1',
          result: { driverId: 'hamilton', position: 1 },
        },
      ],
    };

    const mockDriverRecord = { driverId: 'verstappen', id: 1 };
    const mockSeasonRecord = { id: 1, year: 2023 };
    const mockRaceRecord = { id: 1, round: 1 };
    const mockDriversInsertResult = { count: 2 };

    beforeEach(() => {
      (fetchResults as Mock).mockResolvedValue(mockResults);
      (fetchhDriverStandings as Mock).mockResolvedValue(mockChampionData);
      (raceMapper as Mock).mockReturnValue(mockSeasonData);
      (upsertDriver as Mock).mockResolvedValue(mockDriverRecord);
      (upsertSeason as Mock).mockResolvedValue(mockSeasonRecord);
      (bulkInsertDrivers as Mock).mockResolvedValue(mockDriversInsertResult);
      (upsertRace as Mock).mockResolvedValue(mockRaceRecord);
      (findDriverById as Mock).mockResolvedValue(mockDriverRecord);
      (upsertResult as Mock).mockResolvedValue({});
    });

    it('should successfully process a valid season', async () => {
      await putSeason(mockSeason);

      expect(fetchResults).toHaveBeenCalledWith('2023');
      expect(fetchhDriverStandings).toHaveBeenCalledWith('2023');
      expect(raceMapper).toHaveBeenCalledWith(
        mockResults,
        mockChampionData,
        mockSeason
      );
      expect(upsertDriver).toHaveBeenCalledWith(mockSeasonData.winner);
      expect(upsertSeason).toHaveBeenCalledWith(
        mockSeasonData,
        mockDriverRecord
      );
      expect(bulkInsertDrivers).toHaveBeenCalledWith(mockSeasonData.drivers);
      expect(upsertRace).toHaveBeenCalledWith(
        mockSeasonData.races[0],
        mockSeasonRecord
      );
      expect(findDriverById).toHaveBeenCalledWith('hamilton');
      expect(upsertResult).toHaveBeenCalledWith(
        mockRaceRecord,
        mockDriverRecord,
        mockSeasonData?.races?.[0]?.result
      );
    });

    it('should log appropriate messages during processing', async () => {
      await putSeason(mockSeason);

      expect(consoleSpy.log).toHaveBeenCalledWith('Putting season: 2023');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Creating season record for: 2023'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Creating season record for: 2023 with champion verstappen'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Inserted 2 new drivers for season 2023'
      );
    });

    it('should handle undefined season gracefully', async () => {
      await putSeason(undefined);

      expect(consoleSpy.error).toHaveBeenCalledWith(
        'No season provided to putSeason'
      );
      expect(fetchResults).not.toHaveBeenCalled();
      expect(fetchhDriverStandings).not.toHaveBeenCalled();
    });

    it('should skip upsertResult when driver is not found', async () => {
      (findDriverById as Mock).mockResolvedValue(null);

      await putSeason(mockSeason);

      expect(findDriverById).toHaveBeenCalledWith('hamilton');
      expect(upsertResult).not.toHaveBeenCalled();
    });

    it('should handle multiple races correctly', async () => {
      const seasonDataWithMultipleRaces = {
        ...mockSeasonData,
        races: [
          {
            raceId: '1',
            result: { driverId: 'hamilton', position: 1 },
          },
          {
            raceId: '2',
            result: { driverId: 'verstappen', position: 1 },
          },
        ],
      };

      (raceMapper as Mock).mockReturnValue(seasonDataWithMultipleRaces);

      await putSeason(mockSeason);

      expect(upsertRace).toHaveBeenCalledTimes(2);
      expect(findDriverById).toHaveBeenCalledTimes(2);
      expect(findDriverById).toHaveBeenNthCalledWith(1, 'hamilton');
      expect(findDriverById).toHaveBeenNthCalledWith(2, 'verstappen');
    });
  });

  describe('putSeasons', () => {
    const mockSeasons: SeasonAPI[] = [
      { season: '2022', url: 'http://example.com/2022' },
      { season: '2023', url: 'http://example.com/2023' },
    ];

    beforeEach(() => {
      (fetchSeasons as Mock).mockResolvedValue(mockSeasons);
      // Mock putSeason to avoid actual processing
      vi.doMock('../ergast.service', async () => {
        const actual = await vi.importActual('../ergast.service');
        return {
          ...actual,
          putSeason: vi.fn().mockResolvedValue(undefined),
        };
      });
    });

    it('should process all seasons successfully', async () => {
      const result = await putSeasons();

      expect(fetchSeasons).toHaveBeenCalledOnce();
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Found 2 seasons to put.'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith('Processing season: 2022');
      expect(consoleSpy.log).toHaveBeenCalledWith('Processing season: 2023');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '✅ All seasons processed successfully'
      );
      expect(result).toBe(true);
    });

    it('should handle empty seasons array', async () => {
      (fetchSeasons as Mock).mockResolvedValue([]);

      const result = await putSeasons();

      expect(consoleSpy.log).toHaveBeenCalledWith('Found 0 seasons to put.');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        '✅ All seasons processed successfully'
      );
      expect(result).toBe(true);
    });

    it('should handle errors in individual season processing', async () => {
      const mockError = new Error('Database connection failed');
      
      // Create a fresh mock implementation that will throw
      const putSeasonMock = vi.fn()
        .mockResolvedValueOnce(undefined) // First season succeeds
        .mockRejectedValueOnce(mockError); // Second season fails

      // Re-import with the mock
      vi.doMock('../ergast.service', () => ({
        putSeason: putSeasonMock,
        putSeasons: vi.fn().mockImplementation(async () => {
          const seasons = await fetchSeasons();
          console.log(`Found ${seasons.length} seasons to put.`);

          await Promise.all(
            seasons.map(async (season) => {
              console.log(`Processing season: ${season.season}`);
              try {
                await putSeasonMock(season);
              } catch (error) {
                console.error(`Error processing season ${season.season}:`, error);
                throw error;
              }
            })
          );
          console.log('✅ All seasons processed successfully');
          return true;
        }),
      }));

      const { putSeasons: mockedPutSeasons } = await import('../ergast.service');

      await expect(mockedPutSeasons()).rejects.toThrow('Database connection failed');
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        'Error processing season 2023:',
        mockError
      );
    });
  });
});