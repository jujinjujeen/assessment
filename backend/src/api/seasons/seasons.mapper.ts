import { Season as ApiSeason } from '@f1/types/api-schemas';
import { Season as PrismaSeason } from '@prisma/client';

export function mapSeason(prismaSeason: PrismaSeason): ApiSeason {
  return {
    id: prismaSeason.id,
    year: prismaSeason.year,
    url: prismaSeason.wikiUrl,
  };
}
