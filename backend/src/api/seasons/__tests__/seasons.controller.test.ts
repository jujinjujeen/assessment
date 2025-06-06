// __tests__/seasons.controller.test.ts

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { seasonsController } from '../seasons.controller';
import { getAllSeasons } from '../seasons.service';
import { SeasonsResponse, ErrorResponse } from '@f1/types/api-schemas';

vi.mock('../seasons.service', () => ({
  getAllSeasons: vi.fn(),
}));

describe('seasons.controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response<SeasonsResponse | ErrorResponse>>;
  let mockJson: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });
    
    mockRequest = {};
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    vi.clearAllMocks();
  });

  describe('seasonsController', () => {
    it('should call getAllSeasons and return 200 with seasons', async () => {
      const mockSeasons: SeasonsResponse = [
        { id: 1, year: 2023, url: 'https://example.com/2023' },
        { id: 2, year: 2024, url: 'https://example.com/2024' },
      ];

      vi.mocked(getAllSeasons).mockResolvedValue(mockSeasons);

      await seasonsController(
        mockRequest as Request,
        mockResponse as Response<SeasonsResponse | ErrorResponse>
      );

      expect(getAllSeasons).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockSeasons);
    });
  });
});