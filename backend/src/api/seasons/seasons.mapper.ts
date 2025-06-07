import { Season as ApiSeason } from '@f1/types/api-schemas';
import { SeasonWithChampion } from './types';

export function mapSeason(prismaSeason: SeasonWithChampion): ApiSeason {
  return {
    id: prismaSeason.id,
    year: prismaSeason.year,
    url: prismaSeason.wikiUrl,
    winner:
      `${prismaSeason.champion?.givenName} ${prismaSeason.champion?.familyName}`.trim() ||
      'Unknown',
  };
}
