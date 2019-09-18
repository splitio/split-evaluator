process.env.SPLIT_EVALUATOR_EXT_API_KEY = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining } = require('../../utils/testWrapper');

describe('split', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/manager/split?split-name=split');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/manager/split?split-name=split')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 400 if split-name is not passed', async (done) => {
    const expected = [
      'you passed a null or undefined split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/manager/split')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-name is empty', async (done) => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/manager/split?split-name=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-name is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/manager/split?split-name=     ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 404 if split is not found', async (done) => {
    const response = await request(app)
      .get('/manager/split?split-name=not-found')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Split "not-found" was not found.');
    done();
  });

  test('should be 200 and matches with passed split in YAML', async (done) => {
    const response = await request(app)
      .get('/manager/split?split-name=my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('name', 'my-experiment');
    expect(response.body).toHaveProperty('trafficType', 'localhost');
    expect(response.body).toHaveProperty('killed', false);
    expect(response.body).toHaveProperty('changeNumber', 0);
    expect(response.body).toHaveProperty('treatments');
    expect(response.body.treatments).toEqual(expect.arrayContaining(['on', 'off']));
    expect(response.body).toHaveProperty('configs');
    expect(response.body.configs).toEqual({
      on: '{"desc" : "this applies only to ON treatment"}',
      off: '{"desc" : "this applies only to OFF and only for only_test. The rest will receive ON"}',
    });
    done();
  });
});
