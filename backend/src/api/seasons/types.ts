import { Season, Driver } from '@prisma/client';

export type SeasonWithChampion = Season & {
  champion: Driver | null;
};
