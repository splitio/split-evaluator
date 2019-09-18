process.env.SPLIT_EVALUATOR_EXT_API_KEY = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('uptime', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/admin/uptime');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/admin/uptime')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200', async (done) => {
    const response = await request(app)
      .get('/admin/uptime')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    done();
  });
});
