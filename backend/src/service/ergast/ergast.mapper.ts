import {
  RaceResultsResponse,
  DriverStandingsResponse,
  Season as SeasonAPI,
} from '../../types/ergast';
import { Driver, Season, Race } from './types';

export const raceMapper = (
  resultsAPI: RaceResultsResponse['MRData']['RaceTable'],
  championAPI: DriverStandingsResponse['MRData']['StandingsTable'],
  seasonAPI: SeasonAPI
): Season => {
  const res: Season = {
    year: parseInt(seasonAPI.season, 10),
    url: seasonAPI.url,
    winner: {
      driverId:
        championAPI?.StandingsLists?.[0]?.DriverStandings?.[0]?.Driver
          .driverId || '',
      givenName:
        championAPI?.StandingsLists?.[0]?.DriverStandings?.[0]?.Driver
          .givenName || '',
      familyName:
        championAPI?.StandingsLists?.[0]?.DriverStandings?.[0]?.Driver
          .familyName || '',
    },
    drivers: [],
    races: [],
  };

  const drivers = new Map<string, Driver>();
  const races: Race[] = [];
  resultsAPI?.Races?.forEach((race) => {
    const driverId = race?.Results?.[0]?.Driver?.driverId || '';
    races.push({
      raceName: race?.raceName,
      date: `${race?.date}T${race?.time || '00:00:00'}`,
      result: {
        driverId,
        position: 1,
      },
    });
    drivers.set(driverId, {
      driverId,
      givenName: race?.Results?.[0]?.Driver?.givenName || '',
      familyName: race?.Results?.[0]?.Driver?.familyName || '',
    });
  });
  res.drivers = Array.from(drivers.values());
  res.races = races;
  return res;
};
