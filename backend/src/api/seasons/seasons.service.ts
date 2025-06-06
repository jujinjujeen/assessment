import { Season } from '@f1/types/api-schemas';
import { mapSeason } from './seasons.mapper';
import { findAllSeasons } from './seasons.repo';

export const getAllSeasons = async (): Promise<Season[]> => {
  const seasonsDb = await findAllSeasons();

  return seasonsDb.map(mapSeason);
};
