process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('healthcheck', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/admin/healthcheck');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/admin/healthcheck')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200', async (done) => {
    const response = await request(app)
      .get('/admin/healthcheck')
      .set('Authorization', 'test');
    expect(response.statusCode).toEqual(200);
    done();
  });
});
