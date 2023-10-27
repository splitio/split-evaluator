const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkMultipleResults, getLongKey } = require('../../utils/testWrapper');
const { NULL_FLAG_SETS, EMPTY_FLAG_SETS } = require('../../utils/constants');
const { expectedGreenResults, expectedPurpleResults, expectedPinkResults } = require('../../utils/mocks');

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation((url) => {

    const sdkUrl = 'https://sdk.test.io/api/splitChanges?since=-1';
    const splitChange2 = require('../../utils/mocks/splitchanges.since.-1.till.1602796638344.json');
    if (url.startsWith(sdkUrl)) return Promise.resolve({ status: 200, json: () => (splitChange2), ok: true });

    return Promise.resolve({ status: 200, json: () => ({}), ok: true });
  });
});

describe('get-treatments-by-sets', () => {

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
      .get('/client/get-treatments-by-sets?key=test&flag-sets=my-experiment');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=test&flag-sets=my-experiment')
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
      .get('/client/get-treatments-by-sets?flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=&flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=     &flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is too long', async (done) => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/client/get-treatments-by-sets?key=${key}&flag-sets=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key&bucketing-key=&flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key&bucketing-key=    &flag-sets=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is too long', async (done) => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/client/get-treatments-by-sets?key=key&bucketing-key=${key}&flag-sets=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if flag-sets is not passed', async (done) => {
    const expected = [
      NULL_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if flag-sets is empty', async (done) => {
    const expected = [
      EMPTY_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=test&flag-sets=')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if flag-sets is empty trimmed', async (done) => {
    const expected = [
      EMPTY_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=test&flag-sets=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are errors in key and flag-sets', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SETS
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=&flag-sets=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is invalid', async (done) => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=test&flag-sets=my-experiment&attributes=lalala')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SETS,
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=     &flag-sets=&attributes="lalala"')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors in every input', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      EMPTY_FLAG_SETS,
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-by-sets?bucketing-key=${key}&key=     &flag-sets=&attributes="lalala"`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is an invalid json (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments-by-sets?key=test&flag-sets=my-experiment')
      .set('Content-Type', 'application/json')
      // eslint-disable-next-line no-useless-escape
      .send('\|\\\"/regex/i') // Syntax error parsing the JSON.
      .set('Authorization', 'key_green');
    expectError(response, 400);
    expect(response.body.error.type).toBe('entity.parse.failed'); // validate the error
    done();
  });

  test('should be 200 if is valid attributes (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key_green&flag-sets=set_green&attributes={"test":"test"}')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 when attributes is null (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key_green&flag-sets=set_green')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 if is valid attributes (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments-by-sets?key=key_green&flag-sets=set_green')
      .set('Authorization', 'key_green')
      .send({
        attributes: {test:'test'},
      });
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 if is valid attributes as string (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments-by-sets?key=key_green&flag-sets=set_green')
      .send(JSON.stringify({
        attributes: {test:'test'},
      }))
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 if attributes is null (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments-by-sets?key=key_green&flag-sets=set_green')
      .send({
        attributes: null,
      })
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key_green&flag-sets=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key_purple&flag-sets=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_purple');
    expectOkMultipleResults(response, 200, expectedPurpleResults, 3);
    done();
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-by-sets?key=key_purple&flag-sets=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_pink');
    expectOkMultipleResults(response, 200, expectedPinkResults, 5);
    done();
  });
});
