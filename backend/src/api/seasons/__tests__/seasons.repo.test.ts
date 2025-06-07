import { describe, it, expect, vi, beforeEach } from 'vitest';
import { findAllSeasons } from '../seasons.repo';
import prisma from '@f1/prismaInstance';

describe('seasons.repo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('findAllSeasons', () => {
    it('should call prisma.season.findMany with desc order by default', async () => {
      await findAllSeasons();

      expect(prisma.season.findMany).toHaveBeenCalledWith({
        include: {
          champion: true,
        },
        orderBy: { year: 'desc' },
      });
    });

    it('should call prisma.season.findMany with specified order', async () => {
      await findAllSeasons('asc');

      expect(prisma.season.findMany).toHaveBeenCalledWith({
        include: {
          champion: true,
        },
        orderBy: { year: 'asc' },
      });
    });
  });
});
