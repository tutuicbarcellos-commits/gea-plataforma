export async function healthRoutes(app) {
  app.get('/health', async () => ({
    status: 'ok',
    service: 'gea-backend',
    timestamp: new Date().toISOString(),
  }));
}
