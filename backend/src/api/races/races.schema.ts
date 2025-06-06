import { SEASON_YEAR_LOWER_BOUND } from '@f1/be/constants';
import { z } from 'zod';

const currentYear = new Date().getFullYear();

export const SeasonIdParamSchema = z.object({
  seasonId: z
    .string()
    .refine((val) => /^\d+$/.test(val), {
      message: 'seasonId must be digits only',
    })
    .refine((num) => parseInt(num, 10) >= 2005, {
      message: `seasonId must be at least ${SEASON_YEAR_LOWER_BOUND}`,
    })
    .refine((num) => parseInt(num, 10) <= currentYear, {
      message: `seasonId must be at most ${currentYear}`,
    }),
});
