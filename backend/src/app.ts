// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { router } from './api';
import { errorHandler } from './middleware/errorHandler';

export const createApp = () => {
  const app = express();

  // Security headers
  app.use(helmet());

  // Logging
  app.use(morgan('combined'));

  // CORS
  app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));

  // Body parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/api', router);

  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};