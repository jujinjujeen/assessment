import {
  Race as PrismaRace,
  Driver as PrismaDriver,
  Result as PrismaResult,
} from '@prisma/client';

export type PrismaRaceWithDriver = PrismaRace & {
  result:
    | ({
        driver: PrismaDriver;
      } & PrismaResult)
    | null;
};
