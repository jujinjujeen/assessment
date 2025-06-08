import { Request, Response, NextFunction } from 'express';
import redis from '@f1/redisClient';

export function cacheMiddleware(ttlSeconds: number) {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Only cache GETs exclude health checks
    if (req.method !== 'GET' || req.originalUrl.includes('health')) {
      next();
      return;
    }

    const cacheKey = `cache:${req.originalUrl}`;
    console.log(`Checking cache for ${cacheKey}`);
    const cached = await redis.get(cacheKey);
    if (cached) {
      // short-circuit if we have it
      res.json(JSON.parse(cached));
      return
    }

    // hijack send to capture payload
    const originalSend = res.send.bind(res);
    res.send = (body: unknown) => {
      // only cache 200s
      if (res.statusCode === 200) {
        // body might be Buffer or string
        const payload = typeof body === 'string' ? body : JSON.stringify(body);
        redis.setex(cacheKey, ttlSeconds, payload).catch((err) => {
          console.error(`Failed to cache ${req.originalUrl}:`, err);
        });
      }
      return originalSend(body);
    };

    next();
  };
}
