const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOk, getLongKey } = require('../../utils/testWrapper');

describe('get-treatment', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment')
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
      .get('/client/get-treatment?split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=&split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=     &split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatment?key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=key&bucketing-key=&split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=key&bucketing-key=    &split-name=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is too long', async () => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatment?key=key&bucketing-key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-name is not passed', async () => {
    const expected = [
      'you passed a null or undefined split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-name is empty', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if split-name is empty trimmed', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are errors in key and split-name', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=&split-name=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment&attributes=lalala')
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
      .get('/client/get-treatment?key=     &split-name=&attributes="lalala"')
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
      .get(`/client/get-treatment?bucketing-key=${key}&key=     &split-name=&attributes="lalala"`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is an invalid json (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .set('Content-Type', 'application/json')
      // eslint-disable-next-line no-useless-escape
      .send('\|\\\"/regex/i') // Syntax error parsing the JSON.
      .set('Authorization', 'test');
    expectError(response, 400);
    expect(response.body.error.type).toBe('entity.parse.failed'); // validate the error
  });

  test('should be 200 if is valid attributes (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if attributes is null (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if is valid attributes (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .send({
        attributes: {test:'test'},
      })
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if is valid attributes as string (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .send(JSON.stringify({
        attributes: {test:'test'},
      }))
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if attributes is null (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .send({
        attributes: null,
      })
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  // Testing Multiple Experiments Regarding YAML
  test('should be 200 with multiple experiments', async () => {
    // Checking multiple experiments regarding yml passed
    // With key=test
    let response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
    // With key=only_test
    response = await request(app)
      .get('/client/get-treatment?key=only_test&split-name=my-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'off', 'my-experiment');
    // With another split
    response = await request(app)
      .get('/client/get-treatment?key=test&split-name=other-experiment-3')
      .set('Authorization', 'test');
    expectOk(response, 200, 'off', 'other-experiment-3');
    // With a non-existant split in yml
    response = await request(app)
      .get('/client/get-treatment?key=only_test&split-name=nonexistant-experiment')
      .set('Authorization', 'test');
    expectOk(response, 200, 'control', 'nonexistant-experiment');
  });
  
  test('should be 200 if properties is valid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment&properties={"package":"premium","admin":true,"discount":50}')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if properties is valid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .send({
        properties: { package: 'premium', admin: true, discount: 50 },
      })
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if properties is invalid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment&properties={"foo": {"bar": 1}}')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if properties is invalid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .send({
        properties: { foo: { bar: 1 } },
      })
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if impressionsDisabled is valid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment&properties={"package":"premium","admin":true,"discount":50}&impressionsDisabled=true')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if impressionsDisabled is valid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment&impressionsDisabled=true')
      .send({
        properties: { package: 'premium', admin: true, discount: 50 },
        impressionsDisabled: true,
      })
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if impressionsDisabled is invalid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatment?key=test&split-name=my-experiment&properties={"foo": {"bar": 1}}&impressionsDisabled=lalala')
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });

  test('should be 200 if impressionsDisabled is invalid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatment?key=test&split-name=my-experiment')
      .send({
        properties: { foo: { bar: 1 } },
        impressionsDisabled: 'lalala',
      })
      .set('Authorization', 'test');
    expectOk(response, 200, 'on', 'my-experiment');
  });
});
