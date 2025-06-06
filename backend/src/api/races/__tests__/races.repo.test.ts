import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findSeasonByYear, findRacesBySeasonId } from '../races.repo';
import prisma from '@f1/prismaInstance';

describe('races.repo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findSeasonByYear', () => {
    it('should call prisma.season.findUnique with year', async () => {
      await findSeasonByYear(2023);

      expect(prisma.season.findUnique).toHaveBeenCalledWith({
        where: { year: 2023 },
      });
    });
  });

  describe('findRacesBySeasonId', () => {
    it('should call prisma.race.findMany with correct parameters', async () => {
      await findRacesBySeasonId(1);

      expect(prisma.race.findMany).toHaveBeenCalledWith({
        where: { seasonId: 1 },
        include: {
          result: {
            include: {
              driver: true,
            },
          },
        },
        orderBy: { date: 'desc' },
      });
    });
  });
});