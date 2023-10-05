const request = require('supertest');

const app = require('../../index');

describe('POST /auth/login', () => {
  beforeAll(() => {
    console.log('BEFORE ALL');
  });

  beforeEach(() => {
    console.log('BEFORE EACH');
  });

  afterEach(() => {
    console.log('AFTER EACH');
  });

  afterAll(() => {
    console.log('AFTER ALL');
  });

  it('should return user object and token', async () => {
    const testData = {
      email: 'jimi@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        token: expect.any(String),
        user: expect.any(Object),
      })
    );
  });

  it('should returns 401 error I', async () => {
    const testData = {
      email: 'jim@example.com',
      password: 'Pass&1234',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });

  it('should returns 401 error II', async () => {
    const testData = {
      email: 'jimi@example.com',
    };

    const res = await request(app).post('/api/v1/auth/login').send(testData);

    expect(res.statusCode).toBe(401);
  });
});
