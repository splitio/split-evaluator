process.env.SPLIT_EVALUATOR_EXT_API_KEY = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper');

describe('splits', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/manager/splits');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200 and returns the splits added in YAML', async (done) => {
    const response = await request(app)
      .get('/manager/splits')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('splits');
    const keys = Object.keys(response.body.splits);
    expect(keys.length).toEqual(4);
    done();
  });
});
