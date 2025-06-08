import { findSeasonByYear } from '../api/races/races.repo';
import { fetchSeasons } from '../service/ergast/ergast.client';
import { putSeason } from '../service/ergast/ergast.service';
import { clearCache } from '@f1/redisClient';

/**
 * This script updates the database with the latest seasons and results from the Ergast API.
 * @returns Promise<void>
 */
async function main() {
  console.log('Updating database with new seasons and results...');

  const seasonsApi = await fetchSeasons();
  if (!seasonsApi || seasonsApi.length === 0) {
    console.error('No seasons found in the API response.');
    return;
  }
  seasonsApi.sort((a, b) => parseInt(b.season) - parseInt(a.season));
  seasonsApi.length = 2; // Limit to the last two seasons
  const firstSeason = seasonsApi[0]!;
  const lastSeasonDb = await findSeasonByYear(parseInt(firstSeason.season));
  if (lastSeasonDb) {
    seasonsApi.length = 1; // If the last season is already in the database, only process the most recent one
  }

  for (const season of seasonsApi) {
    try {
      await putSeason(season);
    } catch (error) {
      console.error(`Error processing season ${season.season}:`, error);
    }
  }
  await clearCache();
  console.log('Cache cleared after database update.');
  console.log('Database update completed.');
}

if (require.main === module) {
  
  main().catch((error) => {
    console.error('Error in main execution:', error);
    process.exit(1);
  });
}

export default main;
