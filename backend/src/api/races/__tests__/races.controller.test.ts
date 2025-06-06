/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Request, Response } from 'express';
import { racesController } from '../races.controller';
import { getRacesBySeasonYear } from '../races.service';
import { HTTP_LABEL, HTTP_STATUS } from '@f1/be/constants';
import { RacesResponse, ErrorResponse } from '@f1/types/api-schemas';

// Mock the service
vi.mock('../races.service', () => ({
  getRacesBySeasonYear: vi.fn(),
}));

describe('races.controller', () => {
  let mockRequest: Partial<Request<{ seasonId: string }>>;
  let mockResponse: Partial<Response<RacesResponse | ErrorResponse>>;
  let mockJson: ReturnType<typeof vi.fn>;
  let mockStatus: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockJson = vi.fn();
    mockStatus = vi.fn().mockReturnValue({ json: mockJson });

    mockRequest = {
      params: { seasonId: '2023' },
    };

    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };

    vi.clearAllMocks();
  });

  it('should return races when found', async () => {
    const mockRaces: RacesResponse = [
      {
        id: 1,
        name: 'Bahrain Grand Prix',
        date: '2023-03-05T15:00:00.000Z',
        season: 2023,
        driver: {
          id: 'hamilton',
          givenName: 'Lewis',
          familyName: 'Hamilton',
          isSeasonChampion: true,
        },
      },
      {
        id: 2,
        name: 'Saudi Arabian Grand Prix',
        date: '2023-03-19T15:00:00.000Z',
        season: 2023,
        driver: {
          id: 'verstappen',
          givenName: 'Max',
          familyName: 'Verstappen',
          isSeasonChampion: false,
        },
      },
    ];

    vi.mocked(getRacesBySeasonYear).mockResolvedValue(mockRaces);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    expect(getRacesBySeasonYear).toHaveBeenCalledWith(2023);
    expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.OK);
    expect(mockJson).toHaveBeenCalledWith(mockRaces);
  });

  it('should return 404 when no races found', async () => {
    vi.mocked(getRacesBySeasonYear).mockResolvedValue([]);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    expect(getRacesBySeasonYear).toHaveBeenCalledWith(2023);
    expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
    expect(mockJson).toHaveBeenCalledWith({
      error: HTTP_LABEL.NOT_FOUND,
      message: 'Season with year 2023 not found or has no races.',
      code: HTTP_STATUS.NOT_FOUND,
    });
  });

  it('should parse seasonId correctly', async () => {
    mockRequest.params = { seasonId: '2021' };
    vi.mocked(getRacesBySeasonYear).mockResolvedValue([]);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    expect(getRacesBySeasonYear).toHaveBeenCalledWith(2021);
  });

  it('should handle string seasonId that parses to number', async () => {
    mockRequest.params = { seasonId: '1950' };
    vi.mocked(getRacesBySeasonYear).mockResolvedValue([]);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    expect(getRacesBySeasonYear).toHaveBeenCalledWith(1950);
    expect(mockJson).toHaveBeenCalledWith({
      error: HTTP_LABEL.NOT_FOUND,
      message: 'Season with year 1950 not found or has no races.',
      code: HTTP_STATUS.NOT_FOUND,
    });
  });

  it('should handle invalid seasonId that results in NaN', async () => {
    mockRequest.params = { seasonId: 'invalid' };
    vi.mocked(getRacesBySeasonYear).mockResolvedValue([]);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    expect(getRacesBySeasonYear).toHaveBeenCalledWith(NaN);
    expect(mockStatus).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
  });

  it('should handle service throwing an error', async () => {
    const serviceError = new Error('Database connection failed');
    vi.mocked(getRacesBySeasonYear).mockRejectedValue(serviceError);

    await expect(
      racesController(
        mockRequest as Request<{ seasonId: string }>,
        mockResponse as Response<RacesResponse | ErrorResponse>
      )
    ).rejects.toThrow('Database connection failed');

    expect(getRacesBySeasonYear).toHaveBeenCalledWith(2023);
    expect(mockStatus).not.toHaveBeenCalled();
    expect(mockJson).not.toHaveBeenCalled();
  });

  it('should call getRacesBySeasonYear with correct parameter type', async () => {
    mockRequest.params = { seasonId: '2024' };
    vi.mocked(getRacesBySeasonYear).mockResolvedValue([]);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    const calledWith = vi.mocked(getRacesBySeasonYear as any).mock.calls[0][0];
    expect(typeof calledWith).toBe('number');
    expect(calledWith).toBe(2024);
  });

  it('should use original seasonId string in error message', async () => {
    mockRequest.params = { seasonId: '2025' };
    vi.mocked(getRacesBySeasonYear).mockResolvedValue([]);

    await racesController(
      mockRequest as Request<{ seasonId: string }>,
      mockResponse as Response<RacesResponse | ErrorResponse>
    );

    expect(mockJson).toHaveBeenCalledWith({
      error: HTTP_LABEL.NOT_FOUND,
      message: 'Season with year 2025 not found or has no races.',
      code: HTTP_STATUS.NOT_FOUND,
    });
  });
});
