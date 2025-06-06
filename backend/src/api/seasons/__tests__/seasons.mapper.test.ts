import { describe, it, expect } from 'vitest';
import { mapSeason } from '../seasons.mapper';
import { Season as PrismaSeason } from '@prisma/client';

describe('seasons.mapper', () => {
  describe('mapSeason', () => {
    it('should map PrismaSeason to ApiSeason', () => {
      const prismaSeason: PrismaSeason = {
        id: 1,
        year: 2023,
        wikiUrl:
          'https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship',
        championId: 1,
      };

      const result = mapSeason(prismaSeason);

      expect(result).toEqual({
        id: 1,
        year: 2023,
        url: 'https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship',
      });
    });
  });
});
