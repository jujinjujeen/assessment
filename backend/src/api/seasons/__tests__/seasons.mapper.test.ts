import { describe, it, expect } from 'vitest';
import { mapSeason } from '../seasons.mapper';
import { SeasonWithChampion } from '../types';

describe('seasons.mapper', () => {
  describe('mapSeason', () => {
    it('should map PrismaSeason to ApiSeason', () => {
      const prismaSeason: SeasonWithChampion = {
        id: 1,
        year: 2023,
        wikiUrl:
          'https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship',
        championId: 1,
        champion: {
          id: 1,
          driverId: 'max_verstappen',
          givenName: 'Max',
          familyName: 'Verstappen',
        },
      };

      const result = mapSeason(prismaSeason);

      expect(result).toEqual({
        id: 1,
        year: 2023,
        url: 'https://en.wikipedia.org/wiki/2023_Formula_One_World_Championship',
        winner: 'Max Verstappen',
      });
    });
  });
});
