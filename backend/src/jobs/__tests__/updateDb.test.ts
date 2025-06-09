import { describe, it, expect, vi, beforeEach } from 'vitest';
import main from '../updateDb';
import { findSeasonByYear } from '../../api/races/races.repo';
import { fetchSeasons } from '../../service/ergast/ergast.client';
import { putSeason } from '../../service/ergast/ergast.service';
import { clearCache } from '@f1/redisClient';

vi.mock('../../api/races/races.repo', () => ({
  findSeasonByYear: vi.fn(),
}));

vi.mock('../../service/ergast/ergast.client', () => ({
  fetchSeasons: vi.fn(),
}));

vi.mock('../../service/ergast/ergast.service', () => ({
  putSeason: vi.fn(),
}));

vi.mock('@f1/redisClient', () => ({
  clearCache: vi.fn(),
}));

// Mock console methods
const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('update-database', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('main', () => {
    it('should process seasons and clear cache', async () => {
      const mockSeasons = [
        { season: '2024', url: 'https://example.com/2024' },
        { season: '2023', url: 'https://example.com/2023' },
        { season: '2022', url: 'https://example.com/2022' },
      ];

      vi.mocked(fetchSeasons).mockResolvedValue(mockSeasons);
      vi.mocked(findSeasonByYear).mockResolvedValue(null);
      vi.mocked(putSeason).mockResolvedValue();
      vi.mocked(clearCache).mockResolvedValue();

      await main();

      expect(fetchSeasons).toHaveBeenCalledTimes(1);
      expect(findSeasonByYear).toHaveBeenCalledWith(2024);
      expect(putSeason).toHaveBeenCalledTimes(2);
      expect(putSeason).toHaveBeenNthCalledWith(1, mockSeasons[0]);
      expect(putSeason).toHaveBeenNthCalledWith(2, mockSeasons[1]);
      expect(clearCache).toHaveBeenCalledTimes(1);
    });

    it('should only process one season if latest exists in database', async () => {
      const mockSeasons = [
        { season: '2024', url: '' },
        { season: '2023', url: '' },
      ];
      const mockExistingSeason = {
        id: 1,
        year: 2024,
        wikiUrl: 'https://example.com/2024',
        championId: 1,
      };

      vi.mocked(fetchSeasons).mockResolvedValue(mockSeasons);
      vi.mocked(findSeasonByYear).mockResolvedValue(mockExistingSeason);
      vi.mocked(putSeason).mockResolvedValue();
      vi.mocked(clearCache).mockResolvedValue();

      await main();

      expect(findSeasonByYear).toHaveBeenCalledWith(2024);
      expect(putSeason).toHaveBeenCalledTimes(1);
      expect(putSeason).toHaveBeenCalledWith(mockSeasons[0]);
      expect(clearCache).toHaveBeenCalledTimes(1);
    });

    it('should return early when no seasons found', async () => {
      vi.mocked(fetchSeasons).mockResolvedValue([]);

      await main();

      expect(fetchSeasons).toHaveBeenCalledTimes(1);
      expect(findSeasonByYear).not.toHaveBeenCalled();
      expect(putSeason).not.toHaveBeenCalled();
      expect(clearCache).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'No seasons found in the API response.'
      );
    });

    it('should return early when seasons is empty', async () => {
      vi.mocked(fetchSeasons).mockResolvedValue([]);

      await main();

      expect(fetchSeasons).toHaveBeenCalledTimes(1);
      expect(findSeasonByYear).not.toHaveBeenCalled();
      expect(putSeason).not.toHaveBeenCalled();
      expect(clearCache).not.toHaveBeenCalled();
    });

    it('should handle putSeason errors and continue processing', async () => {
      const mockSeasons = [
        { season: '2024', url: '' },
        { season: '2023', url: '' },
      ];

      vi.mocked(fetchSeasons).mockResolvedValue(mockSeasons);
      vi.mocked(findSeasonByYear).mockResolvedValue(null);
      vi.mocked(putSeason)
        .mockRejectedValueOnce(new Error('Season 2024 failed'))
        .mockResolvedValueOnce();
      vi.mocked(clearCache).mockResolvedValue();

      await main();

      expect(putSeason).toHaveBeenCalledTimes(2);
      expect(clearCache).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error processing season 2024:',
        expect.any(Error)
      );
    });

    it('should sort seasons in descending order', async () => {
      const mockSeasons = [
        { season: '2022', url: '' },
        { season: '2024', url: '' },
        { season: '2023', url: '' },
      ];

      vi.mocked(fetchSeasons).mockResolvedValue(mockSeasons);
      vi.mocked(findSeasonByYear).mockResolvedValue(null);
      vi.mocked(putSeason).mockResolvedValue();
      vi.mocked(clearCache).mockResolvedValue();

      await main();

      expect(putSeason).toHaveBeenNthCalledWith(1, mockSeasons[0]);
      expect(putSeason).toHaveBeenNthCalledWith(2, mockSeasons[1]);
    });
  });
});
