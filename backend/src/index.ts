import 'tsconfig-paths/register';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { createApp } from './app';
import prisma from '@f1/prismaInstance';
import updateDb from './jobs/updateDb';

dotenv.config();

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const bootstrap = async () => {
  try {
    const app = createApp();

    await prisma.$connect();
    console.log('Connected to DB');

    if (process.env.NODE_ENV !== 'development') {
      /**
       * Cron job to update the database with the latest seasons and results
       * On productions this job runs through a separate scheduler
       * through `npm run prisma:update`
       */
      cron.schedule('0 2 * * *', async () => {
        updateDb();
      });
    }
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
  }
};

bootstrap();
