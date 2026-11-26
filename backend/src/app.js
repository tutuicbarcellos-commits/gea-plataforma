import Fastify from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import { config } from './config/env.js';
import { healthRoutes } from './modules/health/routes.js';

export async function buildApp() {
  const app = Fastify({ logger: { level: config.logLevel } });

  await app.register(helmet);
  await app.register(cors, { origin: config.corsOrigin, credentials: true });
  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' });

  await app.register(healthRoutes, { prefix: '/api' });

  return app;
}
