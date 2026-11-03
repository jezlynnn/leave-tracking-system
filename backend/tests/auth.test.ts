import request from 'supertest';
import { Pool } from 'pg';
import app from '../src/app';
import { env } from '../src/config/env';

const testPool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

const testUser = {
  email: `test.${Date.now()}@example.com`,
  password: 'Test@1234',
  firstName: 'Test',
  lastName: 'User',
};

afterAll(async () => {
  await testPool.query(`DELETE FROM users WHERE email = $1`, [testUser.email]);
  await testPool.end();
});

describe('POST /api/auth/register', () => {
  it('creates a new user successfully', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.body.data.passwordHash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/auth/register').send(testUser);
    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('rejects weak password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'other@test.com', password: 'weak' });
    expect(res.status).toBe(422);
    expect(res.body.success).toBe(false);
    expect(res.body.errors).toBeDefined();
  });

  it('rejects invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ ...testUser, email: 'not-an-email' });
    expect(res.status).toBe(422);
  });
});

describe('POST /api/auth/login', () => {
  it('logs in with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.email).toBe(testUser.email);
    expect(res.headers['set-cookie']).toBeDefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPass@1' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects non-existent user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nobody@example.com', password: 'Test@1234' });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let cookie: string;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    cookie = res.headers['set-cookie'][0];
  });

  it('returns current user when authenticated', async () => {
    const res = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe(testUser.email);
  });

  it('returns 401 without session cookie', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  it('destroys session and clears cookie', async () => {
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    const cookie = loginRes.headers['set-cookie'][0];

    const logoutRes = await request(app)
      .post('/api/auth/logout')
      .set('Cookie', cookie);
    expect(logoutRes.status).toBe(200);

    // Session should be gone
    const meRes = await request(app).get('/api/auth/me').set('Cookie', cookie);
    expect(meRes.status).toBe(401);
  });
});
