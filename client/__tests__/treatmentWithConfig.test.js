process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOk, getLongKey } = require('../../utils/testWrapper');

describe('get-treatment-with-config', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=my-experiment');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  // Testing Input Validation.
  // The following tests are going to check null parameters, wrong types or lengths.
  test('should be 400 if key is not passed', async (done) => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=&split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=     &split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is too long', async (done) => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatment-with-config?key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=key&bucketing-key=&split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=key&bucketing-key=    &split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is too long', async (done) => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatment-with-config?key=key&bucketing-key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-name is not passed', async (done) => {
    const expected = [
      'you passed a null or undefined split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-name is empty', async (done) => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-name is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are errors in key and split-name', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=&split-name=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is invalid', async (done) => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=     &split-name=&attributes="lalala"')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors in every input', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatment-with-config?bucketing-key=${key}&key=     &split-name=&attributes="lalala"`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 200 if is valid attributes', async (done) => {
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment', '{"desc" : "this applies only to ON treatment"}');
    done();
  });

  test('should be 200 when attributes is null', async (done) => {
    const response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment', '{"desc" : "this applies only to ON treatment"}');
    done();
  });

  // Testing Multiple Experiments Regarding YAML
  test('should be 200 with multiple experiments', async (done) => {
    // Checking multiple experiments regarding yml passed
    // With key=test
    let response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment', '{"desc" : "this applies only to ON treatment"}');
    // With key=only_test
    response = await request(app)
      .get('/client/get-treatment-with-config?key=only_test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'off', 'my-experiment', '{"desc" : "this applies only to OFF and only for only_test. The rest will receive ON"}'); 
    // With another split
    response = await request(app)
      .get('/client/get-treatment-with-config?key=test&split-name=other-experiment-3')
      .set('Authorization', 'test');
    expectOk(response, 200, 'off', 'other-experiment-3', null);      
    // With a non-existant split in yml
    response = await request(app)
      .get('/client/get-treatment-with-config?key=only_test&split-name=nonexistant-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'control', 'nonexistant-experiment', null);        
    done();
  });
});