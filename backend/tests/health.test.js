import { describe, it, expect, afterAll } from 'vitest';
import { buildApp } from '../src/app.js';

const app = await buildApp();

afterAll(() => app.close());

describe('GET /api/health', () => {
  it('responde com status ok', async () => {
    const response = await app.inject({ method: 'GET', url: '/api/health' });
    expect(response.statusCode).toBe(200);
    expect(response.json().status).toBe('ok');
  });
});
