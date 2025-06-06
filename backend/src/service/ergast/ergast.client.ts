import { persistentGet } from '@f1/be/utils/persistentGet';
import {
  RaceResultsResponse,
  SeasonsResponse,
  DriverStandingsResponse,
} from '@f1/be/types/ergast';
import { ERGAST_API_URL } from '@f1/be/constants';

export const fetchSeasons = async () => {
  console.log('Fetching seasons from Ergast API');
  const seasonsUrl = `${ERGAST_API_URL}/seasons.json?limit=0&offset=55`;
  const seasonsResponse = await persistentGet<SeasonsResponse>(seasonsUrl);
  return seasonsResponse.MRData.SeasonTable.Seasons;
};

export const fetchResults = async (season: string) => {
  const resultsUrl = `${ERGAST_API_URL}/${season}/results/1.json`;
  console.log(`Fetching results from: ${resultsUrl}`);
  const results = await persistentGet<RaceResultsResponse>(resultsUrl);
  return results.MRData.RaceTable;
};

export const fetchhDriverStandings = async (season: string) => {
  const championUrl = `${ERGAST_API_URL}/${season}/driverStandings/1.json`;
  console.log(`Fetching champion data from: ${championUrl}`);
  const championData = await persistentGet<DriverStandingsResponse>(
    championUrl
  );
  return championData.MRData.StandingsTable;
};
