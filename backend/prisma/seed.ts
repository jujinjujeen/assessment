import { PrismaClient } from '@prisma/client';
import { putSeasons } from '@f1/be/service/ergast/ergast.service';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Seeding database...');
  putSeasons();
  console.log('✅ Database seeded successfully');
}

seed()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
  })
  .finally(() => prisma.$disconnect());
