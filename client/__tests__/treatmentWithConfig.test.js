process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOk, getLongKey } = require('../../utils/testWrapper/index');

describe('get-treatment-with-config', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=my-experiment');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=my-experiment')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  // Testing Input Validation.
  // The following tests are going to check null parameters, wrong types or lengths.
  test('should be 400 if key is not passed', async () => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=&split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=     &split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-treatment-with-config?key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });


  test('should be 400 if bucketing-key is empty', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=key&bucketing-key=&split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=key&bucketing-key=    &split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is too long', async () => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-treatment-with-config?key=key&bucketing-key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-name is not passed', async () => {
    const expected = [
      'you passed a null or undefined split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-name is empty', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-name is empty trimmed', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are errors in key and split-name', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=&split-name=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment-with-config?key=     &split-name=&attributes="lalala"')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors in every input', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/get-treatment-with-config?bucketing-key=${key}&key=     &split-name=&attributes="lalala"`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 200 if is valid attributes', async () => {
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment', '{"desc" : "this applies only to ON treatment"}');
  });

  test('should be 200 when attributes is null', async () => {
    const response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment', '{"desc" : "this applies only to ON treatment"}');
  });

  // Testing Multiple Experiments Regarding YAML
  test('should be 200 with multiple experiments', async () => {
    // Checking multiple experiments regarding yml passed
    // With key=test
    let response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment', '{"desc" : "this applies only to ON treatment"}');
    // With key=only_test
    response = await request(app)
      .get('/get-treatment-with-config?key=only_test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'off', 'my-experiment', '{"desc" : "this applies only to OFF and only for only_test. The rest will receive ON"}'); 
    // With another split
    response = await request(app)
      .get('/get-treatment-with-config?key=test&split-name=other-experiment-3')
      .set('Authorization', 'test');
    expectOk(response, 200, 'off', 'other-experiment-3', null);      
    // With a non-existant split in yml
    response = await request(app)
      .get('/get-treatment-with-config?key=only_test&split-name=nonexistant-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'control', 'nonexistant-experiment', null);        
  });
});