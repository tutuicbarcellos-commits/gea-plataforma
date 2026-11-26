const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const config = Object.freeze({
  env: process.env.NODE_ENV ?? 'development',
  host: process.env.HOST ?? '0.0.0.0',
  port: toNumber(process.env.PORT, 3333),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
});
