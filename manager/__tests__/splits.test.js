process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('splits', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/splits');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/splits')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 200 and returns the splits added in YAML', async () => {
    const response = await request(app)
      .get('/splits')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('splits');
    const keys = Object.keys(response.body.splits);
    expect(keys.length).toEqual(4);
  });
});
