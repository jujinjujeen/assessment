/* eslint-disable @typescript-eslint/no-explicit-any */
// __tests__/ergast.client.test.ts
import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import {
  fetchSeasons,
  fetchResults,
  fetchhDriverStandings,
} from '../ergast.client';
import { persistentGet } from '@f1/be/utils/persistentGet';
import {
  RaceResultsResponse,
  SeasonsResponse,
  DriverStandingsResponse,
} from '@f1/be/types/ergast';

// Mock dependencies
vi.mock('@f1/be/utils/persistentGet');

// Mock console methods
const consoleSpy = {
  log: vi.spyOn(console, 'log').mockImplementation(() => {}),
};

describe('ergast.client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchSeasons', () => {
    const mockSeasonsResponse: SeasonsResponse = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/seasons.json',
        limit: '0',
        offset: '55',
        total: '74',
        SeasonTable: {
          Seasons: [
            {
              season: '2023',
              url: 'https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship',
            },
            {
              season: '2022',
              url: 'https://en.wikipedia.org/wiki/2022_Formula_One_World_Championship',
            },
          ],
        },
      },
    };

    it('should fetch seasons successfully', async () => {
      (persistentGet as Mock).mockResolvedValue(mockSeasonsResponse);

      const result = await fetchSeasons();

      expect(persistentGet).toHaveBeenCalledWith(
        'https://api.jolpi.ca/ergast/f1/seasons.json?limit=0&offset=55'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Fetching seasons from Ergast API'
      );
      expect(result).toEqual(mockSeasonsResponse.MRData.SeasonTable.Seasons);
      expect(result).toHaveLength(2);
    });

    it('should handle API errors', async () => {
      const apiError = new Error('API request failed');
      (persistentGet as Mock).mockRejectedValue(apiError);

      await expect(fetchSeasons()).rejects.toThrow('API request failed');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Fetching seasons from Ergast API'
      );
    });

    it('should handle empty seasons response', async () => {
      const emptySeasonsResponse: SeasonsResponse = {
        MRData: {
          xmlns: 'http://ergast.com/mrd/1.5',
          series: 'f1',
          url: 'http://ergast.com/api/f1/seasons.json',
          limit: '0',
          offset: '55',
          total: '0',
          SeasonTable: {
            Seasons: [],
          },
        },
      };

      (persistentGet as Mock).mockResolvedValue(emptySeasonsResponse);

      const result = await fetchSeasons();

      expect(result).toEqual([]);
    });
  });

  describe('fetchResults', () => {
    const mockResultsResponse: RaceResultsResponse = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2023/results/1.json',
        limit: '30',
        offset: '0',
        total: '22',
        RaceTable: {
          season: '2023',
          position: '1',
          Races: [
            {
              season: '2023',
              round: '1',
              url: 'https://en.wikipedia.org/wiki/2023_Bahrain_Grand_Prix',
              raceName: 'Bahrain Grand Prix',
              Circuit: {
                circuitId: 'bahrain',
                url: 'http://en.wikipedia.org/wiki/Bahrain_International_Circuit',
                circuitName: 'Bahrain International Circuit',
                Location: {
                  lat: '26.0325',
                  long: '50.5106',
                  locality: 'Sakhir',
                  country: 'Bahrain',
                },
              },
              date: '2023-03-05',
              time: '15:00:00Z',
              Results: [
                {
                  number: '1',
                  position: '1',
                  positionText: '1',
                  points: '25',
                  Driver: {
                    driverId: 'verstappen',
                    permanentNumber: '1',
                    code: 'VER',
                    url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    dateOfBirth: '1997-09-30',
                    nationality: 'Dutch',
                  },
                  Constructor: {
                    constructorId: 'red_bull',
                    url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing',
                    name: 'Red Bull',
                    nationality: 'Austrian',
                  },
                  grid: '1',
                  laps: '57',
                  status: 'Finished',
                  Time: {
                    millis: '5548515',
                    time: '1:32:28.515',
                  },
                  FastestLap: {
                    rank: '1',
                    lap: '38',
                    Time: {
                      time: '1:33.027',
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    } as any;

    it('should fetch results for a specific season successfully', async () => {
      (persistentGet as Mock).mockResolvedValue(mockResultsResponse);

      const result = await fetchResults('2023');

      expect(persistentGet).toHaveBeenCalledWith(
        'https://api.jolpi.ca/ergast/f1/2023/results/1.json'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Fetching results from: https://api.jolpi.ca/ergast/f1/2023/results/1.json'
      );
      expect(result).toEqual(mockResultsResponse.MRData.RaceTable);
    });

    it('should handle different season formats', async () => {
      (persistentGet as Mock).mockResolvedValue(mockResultsResponse);

      await fetchResults('2020');

      expect(persistentGet).toHaveBeenCalledWith(
        'https://api.jolpi.ca/ergast/f1/2020/results/1.json'
      );
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Season not found');
      (persistentGet as Mock).mockRejectedValue(apiError);

      await expect(fetchResults('1949')).rejects.toThrow('Season not found');
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Fetching results from: https://api.jolpi.ca/ergast/f1/1949/results/1.json'
      );
    });

    it('should handle empty results response', async () => {
      const emptyResultsResponse: RaceResultsResponse = {
        MRData: {
          xmlns: 'http://ergast.com/mrd/1.5',
          series: 'f1',
          url: 'http://ergast.com/api/f1/2025/results/1.json',
          limit: '30',
          offset: '0',
          total: '0',
          RaceTable: {
            season: '2025',
            position: '1',
            Races: [],
          },
        },
      } as any;

      (persistentGet as Mock).mockResolvedValue(emptyResultsResponse);

      const result = await fetchResults('2025');

      expect(result.Races).toEqual([]);
    });
  });

  describe('fetchhDriverStandings', () => {
    const mockDriverStandingsResponse: DriverStandingsResponse = {
      MRData: {
        xmlns: 'http://ergast.com/mrd/1.5',
        series: 'f1',
        url: 'http://ergast.com/api/f1/2023/driverStandings/1.json',
        limit: '30',
        offset: '0',
        total: '1',
        StandingsTable: {
          driverStandings: '1',
          season: '2023',
          round: '22',
          StandingsLists: [
            {
              season: '2023',
              round: '22',
              DriverStandings: [
                {
                  position: '1',
                  positionText: '1',
                  points: '575',
                  wins: '19',
                  Driver: {
                    driverId: 'verstappen',
                    permanentNumber: '1',
                    code: 'VER',
                    url: 'http://en.wikipedia.org/wiki/Max_Verstappen',
                    givenName: 'Max',
                    familyName: 'Verstappen',
                    dateOfBirth: '1997-09-30',
                    nationality: 'Dutch',
                  },
                  Constructors: [
                    {
                      constructorId: 'red_bull',
                      url: 'http://en.wikipedia.org/wiki/Red_Bull_Racing',
                      name: 'Red Bull',
                      nationality: 'Austrian',
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    };

    it('should fetch driver standings for a specific season successfully', async () => {
      (persistentGet as Mock).mockResolvedValue(mockDriverStandingsResponse);

      const result = await fetchhDriverStandings('2023');

      expect(persistentGet).toHaveBeenCalledWith(
        'https://api.jolpi.ca/ergast/f1/2023/driverStandings/1.json'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Fetching champion data from: https://api.jolpi.ca/ergast/f1/2023/driverStandings/1.json'
      );
      expect(result).toEqual(mockDriverStandingsResponse.MRData.StandingsTable);
    });

    it('should handle different season formats', async () => {
      (persistentGet as Mock).mockResolvedValue(mockDriverStandingsResponse);

      await fetchhDriverStandings('2020');

      expect(persistentGet).toHaveBeenCalledWith(
        'https://api.jolpi.ca/ergast/f1/2020/driverStandings/1.json'
      );
    });

    it('should handle API errors', async () => {
      const apiError = new Error('Driver standings not available');
      (persistentGet as Mock).mockRejectedValue(apiError);

      await expect(fetchhDriverStandings('1949')).rejects.toThrow(
        'Driver standings not available'
      );
      expect(consoleSpy.log).toHaveBeenCalledWith(
        'Fetching champion data from: https://api.jolpi.ca/ergast/f1/1949/driverStandings/1.json'
      );
    });

    it('should handle empty driver standings response', async () => {
      const emptyStandingsResponse: DriverStandingsResponse = {
        MRData: {
          xmlns: 'http://ergast.com/mrd/1.5',
          series: 'f1',
          url: 'http://ergast.com/api/f1/2025/driverStandings/1.json',
          limit: '30',
          offset: '0',
          total: '0',
          StandingsTable: {
            driverStandings: '1',
            season: '2025',
            round: '1',
            StandingsLists: [],
          },
        },
      };

      (persistentGet as Mock).mockResolvedValue(emptyStandingsResponse);

      const result = await fetchhDriverStandings('2025');

      expect(result.StandingsLists).toEqual([]);
    });

    it('should handle edge case seasons correctly', async () => {
      (persistentGet as Mock).mockResolvedValue(mockDriverStandingsResponse);

      // Test with various season formats
      await fetchhDriverStandings('1950'); // First F1 season
      await fetchhDriverStandings('2024'); // Future season

      expect(persistentGet).toHaveBeenNthCalledWith(
        1,
        'https://api.jolpi.ca/ergast/f1/1950/driverStandings/1.json'
      );
      expect(persistentGet).toHaveBeenNthCalledWith(
        2,
        'https://api.jolpi.ca/ergast/f1/2024/driverStandings/1.json'
      );
    });
  });
});
