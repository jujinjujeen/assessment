// backend/src/service/ergast/__tests__/ergast.mapper.test.ts
import { describe, it, expect } from 'vitest';
import { raceMapper } from '../ergast.mapper';
import type {
  RaceResultsResponse,
  DriverStandingsResponse,
  Season as SeasonAPI,
} from '@f1/be/types/ergast';
import type { Season, Race } from '../types';

describe('raceMapper', () => {
  it('maps a normal payload with one race and a champion correctly', () => {
    const seasonAPI: SeasonAPI = {
      season: '2023',
      url: 'https://example.com/2023',
    };

    // Mock DriverStandingsResponse.MRData.StandingsTable
    const championAPI: DriverStandingsResponse['MRData']['StandingsTable'] = {
      StandingsLists: [
        {
          DriverStandings: [
            {
              Driver: {
                driverId: 'hamilton',
                givenName: 'Lewis',
                familyName: 'Hamilton',
                // other fields omitted
              },
              // other fields omitted
            },
          ],
        },
      ],
    } as DriverStandingsResponse['MRData']['StandingsTable'];

    // Mock RaceResultsResponse.MRData.RaceTable
    const resultsAPI: RaceResultsResponse['MRData']['RaceTable'] = {
      Races: [
        {
          raceName: 'Australian Grand Prix',
          date: '2023-03-03',
          time: '05:00:00Z',
          Results: [
            {
              Driver: {
                driverId: 'verstappen',
                givenName: 'Max',
                familyName: 'Verstappen',
                // other fields omitted
              },
              // other fields omitted
            },
          ],
          // other fields omitted
        },
      ],
    } as RaceResultsResponse['MRData']['RaceTable'];

    const mapped: Season = raceMapper(resultsAPI, championAPI, seasonAPI);

    // Check top-level Season fields
    expect(mapped.year).toBe(2023);
    expect(mapped.url).toBe('https://example.com/2023');
    expect(mapped.winner).toEqual({
      driverId: 'hamilton',
      givenName: 'Lewis',
      familyName: 'Hamilton',
    });

    // Only one driver (the race winner)
    expect(mapped.drivers).toHaveLength(1);
    expect(mapped.drivers[0]).toEqual({
      driverId: 'verstappen',
      givenName: 'Max',
      familyName: 'Verstappen',
    });

    // Only one race mapped
    expect(mapped.races).toHaveLength(1);
    const race0: Race = mapped.races[0] as Race;
    expect(race0.raceName).toBe('Australian Grand Prix');
    expect(race0.date).toBe('2023-03-03T05:00:00Z');
    expect(race0.result).toEqual({ driverId: 'verstappen', position: 1 });
  });

  it('handles missing time by defaulting to "00:00:00"', () => {
    const seasonAPI: SeasonAPI = { season: '2022', url: 'url-2022' };
    const championAPI: DriverStandingsResponse['MRData']['StandingsTable'] = {
      StandingsLists: [
        {
          DriverStandings: [
            {
              Driver: { driverId: 'alonso', givenName: 'Fernando', familyName: 'Alonso' },
            },
          ],
        },
      ],
    } as DriverStandingsResponse['MRData']['StandingsTable'];
    const resultsAPI: RaceResultsResponse['MRData']['RaceTable'] = {
      Races: [
        {
          raceName: 'Monaco Grand Prix',
          date: '2022-05-29',
          // time is missing
          Results: [
            {
              Driver: { driverId: 'leclerc', givenName: 'Charles', familyName: 'Leclerc' },
            },
          ],
        },
      ],
    } as RaceResultsResponse['MRData']['RaceTable'];

    const mapped: Season = raceMapper(resultsAPI, championAPI, seasonAPI);

    expect(mapped.year).toBe(2022);
    expect(mapped.winner.driverId).toBe('alonso');
    expect(mapped?.drivers?.[0]?.driverId).toBe('leclerc');
    expect(mapped?.races?.[0]?.date).toBe('2022-05-29T00:00:00');
    expect(mapped?.races?.[0]?.result.driverId).toBe('leclerc');
  });

  it('deduplicates drivers when the same driver wins multiple races', () => {
    const seasonAPI: SeasonAPI = { season: '2021', url: 'url-2021' };
    const championAPI: DriverStandingsResponse['MRData']['StandingsTable'] = {
      StandingsLists: [
        {
          DriverStandings: [
            {
              Driver: { driverId: 'hamilton', givenName: 'Lewis', familyName: 'Hamilton' },
            },
          ],
        },
      ],
    } as DriverStandingsResponse['MRData']['StandingsTable'];
    const resultsAPI: RaceResultsResponse['MRData']['RaceTable'] = {
      Races: [
        {
          raceName: 'Bahrain GP',
          date: '2021-03-28',
          time: '15:00:00Z',
          Results: [
            {
              Driver: { driverId: 'hamilton', givenName: 'Lewis', familyName: 'Hamilton' },
            },
          ],
        },
        {
          raceName: 'Saudi Arabian GP',
          date: '2021-03-05',
          time: '15:00:00Z',
          Results: [
            {
              Driver: { driverId: 'hamilton', givenName: 'Lewis', familyName: 'Hamilton' },
            },
          ],
        },
      ],
    } as RaceResultsResponse['MRData']['RaceTable'];

    const mapped: Season = raceMapper(resultsAPI, championAPI, seasonAPI);

    expect(mapped.drivers).toHaveLength(1);
    expect(mapped.drivers[0]).toEqual({
      driverId: 'hamilton',
      givenName: 'Lewis',
      familyName: 'Hamilton',
    });

    expect(mapped.races).toHaveLength(2);
    expect(mapped?.races?.[0]?.raceName).toBe('Bahrain GP');
    expect(mapped?.races?.[1]?.raceName).toBe('Saudi Arabian GP');
  });

  it('handles missing champion data by defaulting to empty strings', () => {
    const seasonAPI: SeasonAPI = { season: '2020', url: 'url-2020' };
    // championAPI is missing or empty
    const championAPI: DriverStandingsResponse['MRData']['StandingsTable'] = {
      StandingsLists: [] as DriverStandingsResponse['MRData']['StandingsTable']['StandingsLists'], // no entries
    } as DriverStandingsResponse['MRData']['StandingsTable'];
    const resultsAPI: RaceResultsResponse['MRData']['RaceTable'] = {
      Races: [
        {
          raceName: 'Italian GP',
          date: '2020-09-06',
          time: '15:00:00Z',
          Results: [
            {
              Driver: { driverId: 'bottas', givenName: 'Valtteri', familyName: 'Bottas' },
            },
          ],
        },
      ],
    } as RaceResultsResponse['MRData']['RaceTable'];

    const mapped: Season = raceMapper(resultsAPI, championAPI, seasonAPI);

    expect(mapped.year).toBe(2020);
    expect(mapped.url).toBe('url-2020');
    expect(mapped.winner).toEqual({ driverId: '', givenName: '', familyName: '' });

    expect(mapped.drivers).toHaveLength(1);
    expect(mapped?.drivers?.[0]?.driverId).toBe('bottas');
  });

  it('returns empty arrays if there are no races', () => {
    const seasonAPI: SeasonAPI = { season: '2019', url: 'url-2019' };
    const championAPI: DriverStandingsResponse['MRData']['StandingsTable'] = {
      StandingsLists: [
        {
          DriverStandings: [
            {
              Driver: { driverId: 'vettel', givenName: 'Sebastian', familyName: 'Vettel' },
            },
          ],
        },
      ],
    } as DriverStandingsResponse['MRData']['StandingsTable'];
    const resultsAPI: RaceResultsResponse['MRData']['RaceTable'] = {
      Races: [] as RaceResultsResponse['MRData']['RaceTable']['Races'], // no races
    } as RaceResultsResponse['MRData']['RaceTable'];

    const mapped: Season = raceMapper(resultsAPI, championAPI, seasonAPI);

    expect(mapped.year).toBe(2019);
    expect(mapped.winner.driverId).toBe('vettel');
    expect(mapped.drivers).toEqual([]);
    expect(mapped.races).toEqual([]);
  });
});