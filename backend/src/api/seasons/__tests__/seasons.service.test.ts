/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAllSeasons } from '../seasons.service';
import { findAllSeasons } from '../seasons.repo';
import { mapSeason } from '../seasons.mapper';

vi.mock('../seasons.repo', () => ({
  findAllSeasons: vi.fn(),
}));

vi.mock('../seasons.mapper', () => ({
  mapSeason: vi.fn(),
}));

describe('seasons.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllSeasons', () => {
    it('should call findAllSeasons and map each season', async () => {
      const mockDbSeasons = [
        { id: 1, year: 2023 },
        { id: 2, year: 2024 },
      ];
      const mockMappedSeasons = [
        { year: 2023 },
        { year: 2024 },
      ];

      vi.mocked(findAllSeasons).mockResolvedValue(mockDbSeasons as any);
      vi.mocked(mapSeason)
        .mockReturnValueOnce(mockMappedSeasons[0] as any)
        .mockReturnValueOnce(mockMappedSeasons[1] as any);

      const result = await getAllSeasons();

      expect(findAllSeasons).toHaveBeenCalledTimes(1);
      expect(mapSeason).toHaveBeenCalledTimes(2);
      expect(result).toEqual(mockMappedSeasons);
    });

    it('should return empty array when no seasons found', async () => {
      vi.mocked(findAllSeasons).mockResolvedValue([]);

      const result = await getAllSeasons();

      expect(findAllSeasons).toHaveBeenCalledTimes(1);
      expect(mapSeason).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
