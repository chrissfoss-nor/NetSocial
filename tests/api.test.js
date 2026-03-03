const request = require('supertest');

// Use an in-memory DB for tests
process.env.DB_PATH = ':memory:';

const app = require('../app');

// Helper: extract the csrf_token from a Set-Cookie header
function extractCsrfToken(res) {
  const cookies = res.headers['set-cookie'] || [];
  for (const cookie of cookies) {
    const match = cookie.match(/csrf_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }
  return null;
}

// Helper: perform a GET to seed the CSRF cookie, then return the token
async function getCsrfToken(agent) {
  const res = await agent.get('/');
  return extractCsrfToken(res);
}

describe('POST /api/auth/register', () => {
  test('rejects non-student email', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ola',
      email: 'ola@gmail.com',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/student email/i);
  });

  test('rejects email without stud subdomain', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ola',
      email: 'ola@ntnu.no',
      password: 'password123',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/student email/i);
  });

  test('accepts valid student email and creates account', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Ola Nordmann',
      email: 'ola@stud.ntnu.no',
      password: 'password123',
    });
    expect(res.status).toBe(201);
    expect(res.body.message).toBeDefined();
  });

  test('rejects duplicate email', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Kari',
      email: 'kari@stud.uio.no',
      password: 'password123',
    });
    const res = await request(app).post('/api/auth/register').send({
      name: 'Kari2',
      email: 'kari@stud.uio.no',
      password: 'password456',
    });
    expect(res.status).toBe(409);
  });

  test('rejects short password', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'Per',
      email: 'per@stud.ntnu.no',
      password: 'short',
    });
    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  test('rejects missing fields', async () => {
    const res = await request(app).post('/api/auth/register').send({ name: 'Per' });
    expect(res.status).toBe(400);
  });
});

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Login User',
      email: 'loginuser@stud.ntnu.no',
      password: 'password123',
    });
  });

  test('logs in with correct credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@stud.ntnu.no',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
  });

  test('rejects wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'loginuser@stud.ntnu.no',
      password: 'wrongpassword',
    });
    expect(res.status).toBe(401);
  });

  test('rejects non-existent email', async () => {
    const res = await request(app).post('/api/auth/login').send({
      email: 'nobody@stud.ntnu.no',
      password: 'password123',
    });
    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  test('returns 401 when not authenticated', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  test('returns user info when authenticated', async () => {
    const agent = request.agent(app);
    await agent.post('/api/auth/register').send({
      name: 'Me User',
      email: 'meuser@stud.uib.no',
      password: 'password123',
    });
    const res = await agent.get('/api/auth/me');
    expect(res.status).toBe(200);
    expect(res.body.email).toBe('meuser@stud.uib.no');
  });
});

describe('Posts API', () => {
  let agent;

  beforeAll(async () => {
    agent = request.agent(app);
    await agent.post('/api/auth/register').send({
      name: 'Post User',
      email: 'postuser@stud.hvl.no',
      password: 'password123',
    });
  });

  test('unauthenticated POST /api/posts returns 401', async () => {
    const res = await request(app).post('/api/posts').send({ content: 'Hello' });
    expect(res.status).toBe(401);
  });

  test('authenticated user can create a post', async () => {
    const res = await agent.post('/api/posts').send({ content: 'Hello students!' });
    expect(res.status).toBe(201);
    expect(res.body.content).toBe('Hello students!');
    expect(res.body.author).toBe('Post User');
  });

  test('GET /api/posts returns array', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  test('rejects empty post content', async () => {
    const res = await agent.post('/api/posts').send({ content: '   ' });
    expect(res.status).toBe(400);
  });

  test('rejects post content over 500 chars', async () => {
    const res = await agent.post('/api/posts').send({ content: 'x'.repeat(501) });
    expect(res.status).toBe(400);
  });
});

describe('CSRF protection', () => {
  test('browser session POST without CSRF token header is rejected', async () => {
    const agent = request.agent(app);
    // Seed the csrf_token cookie via a GET
    await getCsrfToken(agent);
    // Now POST without the header – should be rejected
    const res = await agent.post('/api/auth/register').send({
      name: 'BadActor',
      email: 'badactor@stud.ntnu.no',
      password: 'password123',
    });
    expect(res.status).toBe(403);
  });

  test('browser session POST with correct CSRF token is accepted', async () => {
    const agent = request.agent(app);
    const csrfToken = await getCsrfToken(agent);
    const res = await agent
      .post('/api/auth/register')
      .set('X-CSRF-Token', csrfToken)
      .send({
        name: 'Good Student',
        email: 'goodstudent@stud.oslomet.no',
        password: 'password123',
      });
    expect(res.status).toBe(201);
  });

  test('browser session POST with wrong CSRF token is rejected', async () => {
    const agent = request.agent(app);
    await getCsrfToken(agent); // seed cookie
    const res = await agent
      .post('/api/auth/register')
      .set('X-CSRF-Token', 'wrongtoken')
      .send({
        name: 'Hacker',
        email: 'hacker@stud.ntnu.no',
        password: 'password123',
      });
    expect(res.status).toBe(403);
  });
});
