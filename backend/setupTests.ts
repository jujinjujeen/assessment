import { vi } from 'vitest';

const populatePrismaMock = () => ({
  create: vi.fn(),
  upsert: vi.fn(),
  createMany: vi.fn(),
  findUnique: vi.fn(),
});

vi.mock('@f1/prismaInstance', () => {
  return {
    default: {
      driver: populatePrismaMock(),
      season: populatePrismaMock(),
      race: populatePrismaMock(),
      result: populatePrismaMock(),
    },
  };
});
