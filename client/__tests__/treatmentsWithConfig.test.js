process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkMultipleResults, getLongKey } = require('../../utils/testWrapper/index');

describe('get-treatments-with-config', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  // Testing Input Validation
  test('should be 400 if key is not passed', async () => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=&split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=     &split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-treatments-with-config?key=${key}&split-names=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=key&bucketing-key=&split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=key&bucketing-key=    &split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is too long', async () => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-treatments-with-config?key=key&bucketing-key=${key}&split-names=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-names is not passed', async () => {
    const expected = [
      'you passed a null or undefined split-names, split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-names is empty', async () => {
    const expected = [
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-names is empty trimmed', async () => {
    const expected = [
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are errors in key and split-names', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=&split-names=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment&attributes="lalala"')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatments-with-config?key=     &split-names=&attributes="lalala"')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors in every input', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-treatments-with-config?bucketing-key=${key}&key=     &split-names=&attributes="lalala"`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 200 if is valid attributes', async () => {
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
        config: '{"desc" : "this applies only to ON treatment"}',
      }
    }, 1);
  });

  test('should be 200 when attributes is null', async () => {
    const response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment,my-experiment')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
        config: '{"desc" : "this applies only to ON treatment"}',
      }
    }, 1);
  });

  // Testing Multiple Experiments Regarding YAML
  test('should be 200 with multiple evaluation', async () => {
    let response = await request(app)
      .get('/get-treatments-with-config?key=test&split-names=my-experiment,other-experiment-3,my-experiment,nonexistant-experiment')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
        config: '{"desc" : "this applies only to ON treatment"}',
      },
      'other-experiment-3': {
        treatment: 'off',
        config: null,
      },
      'nonexistant-experiment': {
        treatment: 'control',
        config: null,
      },
    }, 3);
  });
});