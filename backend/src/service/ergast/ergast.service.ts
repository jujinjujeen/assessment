import { Season as SeasonAPI } from '../../types/ergast';
import { raceMapper } from './ergast.mapper';
import {
  fetchhDriverStandings,
  fetchResults,
  fetchSeasons,
} from './ergast.client';
import {
  bulkInsertDrivers,
  findDriverById,
  upsertDriver,
  upsertRace,
  upsertResult,
  upsertSeason,
} from './ergast.repo';

/**
 * Puts a season into the database.
 * This function processes the provided season data, fetches related results and champion data,
 * and stores the information in the database.
 * @param season - The season data to be processed and stored.
 * @returns
 */
export const putSeason = async (season?: SeasonAPI) => {
  if (!season) {
    console.error('No season provided to putSeason');
    return;
  }
  const { season: seasonName } = season;
  console.log(`Putting season: ${seasonName}`);

  // Fetch the results for the season
  const results = await fetchResults(seasonName);
  // Fetch the champion for the season
  const championData = await fetchhDriverStandings(seasonName);

  const seasonData = raceMapper(results, championData, season);

  console.log(`Creating season record for: ${seasonData.year}`);
  const topDriver = await upsertDriver(seasonData.winner);

  console.log(
    `Creating season record for: ${seasonData.year} with champion ${topDriver.driverId}`
  );
  const seasonRecord = await upsertSeason(seasonData, topDriver);

  const driversRecord = await bulkInsertDrivers(seasonData.drivers);
  console.log(
    `Inserted ${driversRecord.count} drivers for season ${seasonData.year}`
  );

  for (const race of seasonData.races) {
    const raceRecord = await upsertRace(race, seasonRecord);
    const thisDriver = await findDriverById(race.result.driverId);
    if (thisDriver) {
      await upsertResult(raceRecord, thisDriver, race.result);
    }
  }
};

/**
 * Puts all seasons into the database.
 * This function fetches all seasons from the Ergast API and processes each season
 * to store it in the database.
 */
export const putSeasons = async () => {
  const seasons = await fetchSeasons();
  console.log(`Found ${seasons.length} seasons to put.`);

  await Promise.all(
    seasons.map(async (season) => {
      console.log(`Processing season: ${season.season}`);
      try {
        await putSeason(season);
      } catch (error) {
        console.error(`Error processing season ${season.season}:`, error);
        throw error;
      }
    })
  );
  console.log('✅ All seasons processed successfully');
  return true;
};
