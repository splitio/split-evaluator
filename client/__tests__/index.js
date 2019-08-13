
const request = require('supertest');
const app = require('../../app');

describe('get-treatment', () => {
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment');
    expect(response.statusCode).toBe(401);
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'invalid');
    expect(response.statusCode).toBe(401);
  });

  test('should be 200 if auth is valid', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('splitName', 'my-experiment');
    expect(response.body).toHaveProperty('treatment', 'on');
  });
});