import prisma from '@f1/prismaInstance';

async function main() {
  const count = await prisma.season.count();
  console.log(count, 'seasons found in the database');
  
  if (count > 0) {
    process.exit(0); // “OK, skip seeding”
  }
  process.exit(1); // “No rows; please seed”
}

main().catch((err) => {
  console.error('Seed-checker failed:', err);
  // If the DB itself is missing or schema broken, we probably want to seed anyway
  process.exit(1);
});