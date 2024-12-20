const os = require('os');
const ip = require('@splitsoftware/splitio/cjs/utils/ip');
const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('machine', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/admin/machine');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/admin/machine')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 200', async () => {
    const response = await request(app)
      .get('/admin/machine')
      .set('Authorization', 'test');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('ip', ip.address());
    expect(response.body).toHaveProperty('name', os.hostname());
  });
});
