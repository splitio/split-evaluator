const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkMultipleResults, getLongKey } = require('../../utils/testWrapper');
const { NULL_FLAG_SET, EMPTY_FLAG_SET, MAYBE_FLAG_SETS } = require('../../utils/constants');
const { expectedGreenResultsWithConfig, expectedPurpleResultsWithConfig } = require('../../utils/mocks');

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation((url) => {
    const sdkUrl = 'https://sdk.test.io/api/splitChanges?since=-1';
    const splitChange2 = require('../../utils/mocks/splitchanges.since.-1.till.1602796638344.json');
    if (url.startsWith(sdkUrl)) return Promise.resolve({ status: 200, json: () => (splitChange2), ok: true});
    return Promise.resolve({ status: 200, json: () => ({}), ok: true });
  });
});

describe('get-treatments-with-config-by-set', () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Unmock fetch
    jest.unmock('node-fetch');
  });

  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=test&flag-set=my-experiment');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=test&flag-set=my-experiment')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  // Testing Input Validation
  test('should be 400 if key is not passed', async (done) => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?flag-set=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=&flag-set=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=     &flag-set=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is too long', async (done) => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-set?key=${key}&flag-set=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key&bucketing-key=&flag-set=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key&bucketing-key=    &flag-set=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is too long', async (done) => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-set?key=key&bucketing-key=${key}&flag-set=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if flag-set is not passed', async (done) => {
    const expected = [
      NULL_FLAG_SET
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if flag-set is empty', async (done) => {
    const expected = [
      EMPTY_FLAG_SET
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=test&flag-set=')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if flag-set is empty trimmed', async (done) => {
    const expected = [
      EMPTY_FLAG_SET
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=test&flag-set=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are errors in key and flag-set', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SET
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=&flag-set=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is invalid', async (done) => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=test&flag-set=my-experiment&attributes=lalala')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SET,
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=     &flag-set=&attributes="lalala"')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors in every input', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SET,
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-set?bucketing-key=${key}&key=     &flag-set=&attributes="lalala"`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 with multiple evaluation', async (done) => {
    const expected = [
      MAYBE_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-set?key=key_green&flag-set=set_green,set_purple')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 with multiple evaluation (POST)', async (done) => {
    const expected = [
      MAYBE_FLAG_SETS
    ];
    const response = await request(app)
      .post('/client/get-treatments-by-set?key=key_green&flag-set=set_green,set_purple')
      .set('Content-Type', 'application/json')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 200 if is valid attributes (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key_green&flag-set=set_green&attributes={"test":"test"}')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
    done();
  });

  test('should be 200 when attributes is null (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key_green&flag-set=set_green')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
    done();
  });

  test('should be 200 if is valid attributes (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments-with-config-by-set?key=key_green&flag-set=set_green')
      .send({attributes: { test:'test' }})
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
    done();
  });

  test('should be 200 if is valid attributes stringified (POST)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key_green&flag-set=set_green&attributes={"test":"test"}')
      .send(JSON.stringify({attributes: { test:'test' }}))
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
    done();
  });

  test('should be 200 when attributes is null (POST)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key_green&flag-set=set_green')
      .send({
        attributes: null,
      })
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResultsWithConfig, 3);
    done();
  });

  test('should be 200 and return an empty evaluation for not configured sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key_purple&flag-set=set_purple')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, [], 0);
    done();
  });

  test('should be 200 for configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-set?key=key_pink&flag-set=set_purple')
      .set('Authorization', 'key_pink');
    expectOkMultipleResults(response, 200, expectedPurpleResultsWithConfig, 3);
    done();
  });
});
