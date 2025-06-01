// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import { router } from './api';
import { errorHandler } from './middleware/errorHandler';
import { pathResolve } from './utils/pathResolve';

export const createApp = () => {
  const app = express();
  const swaggerDocument = YAML.load(
    pathResolve(import.meta.url, '../docs/openapi.yaml')
  );

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
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use('/api', router);

  // 404 fallback
  app.use((_req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
};
