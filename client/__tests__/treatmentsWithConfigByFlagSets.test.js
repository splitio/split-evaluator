const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkMultipleResults, getLongKey } = require('../../utils/testWrapper');
const { NULL_FLAG_SETS, EMPTY_FLAG_SETS } = require('../../utils/constants');
const { expectedGreenResultsWithConfig, expectedPurpleResultsWithConfig, expectedPinkResultsWithConfig } = require('../../utils/mocks');

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation((url) => {
    const sdkUrl = 'https://sdk.test.io/api/splitChanges?s=1.3&since=-1';
    const splitChange2 = require('../../utils/mocks/splitchanges.since.-1.till.1602796638344.json');
    if (url.startsWith(sdkUrl)) return Promise.resolve({ status: 200, json: () => (splitChange2), ok: true});
    return Promise.resolve({ status: 200, json: () => ({}), ok: true });
  });
});

describe('get-treatments-with-config-by-sets', () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Unmock fetch
    jest.unmock('node-fetch');
  });

  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=my-experiment');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=my-experiment')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  // Testing Input Validation
  test('should be 400 if key is not passed', async () => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=&flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=     &flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-sets?key=${key}&flag-sets=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key&bucketing-key=&flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key&bucketing-key=    &flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if bucketing-key is too long', async () => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-sets?key=key&bucketing-key=${key}&flag-sets=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if flag-sets is not passed', async () => {
    const expected = [
      NULL_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if flag-sets is empty', async () => {
    const expected = [
      EMPTY_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if flag-sets is empty trimmed', async () => {
    const expected = [
      EMPTY_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are errors in key and flag-sets', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=&flag-sets=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=my-experiment&attributes=lalala')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SETS,
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=     &flag-sets=&attributes="lalala"')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors in every input', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SETS,
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-sets?bucketing-key=${key}&key=     &flag-sets=&attributes="lalala"`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 200 if is valid attributes (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&flag-sets=set_green&attributes={"test":"test"}')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
  });

  test('should be 200 when attributes is null (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&flag-sets=set_green')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
  });

  test('should be 200 if is valid attributes (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatments-with-config-by-sets?key=key_green&flag-sets=set_green')
      .send({attributes: { test:'test' }})
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
  });

  test('should be 200 if is valid attributes stringified (POST)', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&flag-sets=set_green&attributes={"test":"test"}')
      .send(JSON.stringify({attributes: { test:'test' }}))
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
  });

  test('should be 200 when attributes is null (POST)', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&flag-sets=set_green')
      .send({
        attributes: null,
      })
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&flag-sets=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_purple&flag-sets=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_purple');
    expectOkMultipleResults(response, 200, expectedPurpleResultsWithConfig, 3);
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_purple&flag-sets=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_pink');
    expectOkMultipleResults(response, 200, expectedPinkResultsWithConfig, 5);
  });

  test('should be 200 if properties is valid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=set_green&properties={"package":"premium","admin":true,"discount":50}')
      .set('Authorization', 'key_green');
    expect(response.status).toBe(200);
  });

  test('should be 200 if properties is valid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatments-with-config-by-sets?key=test&flag-sets=set_green')
      .send({
        properties: { package: 'premium', admin: true, discount: 50 },
      })
      .set('Authorization', 'key_green');
    expect(response.status).toBe(200);
  });

  test('should be 200 if properties is invalid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&flag-sets=set_green&properties={"foo": {"bar": 1}}')
      .set('Authorization', 'key_green');
    expect(response.status).toBe(200);
  });

  test('should be 200 if properties is invalid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-treatments-with-config-by-sets?key=test&flag-sets=set_green')
      .send({
        properties: { foo: { bar: 1 } },
      })
      .set('Authorization', 'key_green');
    expect(response.status).toBe(200);
  });
});
