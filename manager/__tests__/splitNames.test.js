process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper');

describe('names', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/manager/names');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200 and retuns the splits defined in YAML', async (done) => {
    const response = await request(app)
      .get('/manager/names')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('splits');
    expect(response.body.splits.length).toEqual(4);
    expect(response.body.splits)
      .toEqual(expect.arrayContaining(['my-experiment', 'other-experiment-3', 'other-experiment', 'other-experiment-2']));
    done();
  });
});
