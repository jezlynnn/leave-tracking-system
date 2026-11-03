import request from 'supertest';
import app from '../src/app';

describe('GET /api/health', () => {
  it('returns 200 with success true', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('LMS API is running');
    expect(res.body.timestamp).toBeDefined();
  });

  it('returns 404 for unknown routes', async () => {
    const res = await request(app).get('/api/unknown-route');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
