process.env.SPLIT_EVALUATOR_EXT_API_KEY = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const os = require('os');
const ip = require('ip');
const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('machine', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/admin/machine');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/admin/machine')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200', async (done) => {
    const response = await request(app)
      .get('/admin/machine')
      .set('Authorization', 'test');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('ip', ip.address());
    expect(response.body).toHaveProperty('name', os.hostname());
    done();
  });
});
