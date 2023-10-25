const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkMultipleResults, getLongKey } = require('../../utils/testWrapper');

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation((url) => {
    const sdkUrl = 'https://sdk.test.io/api/splitChanges?since=-1';
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
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&set-names=my-experiment');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&set-names=my-experiment')
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
      .get('/client/get-treatments-with-config-by-sets?set-names=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=&set-names=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=     &set-names=test')
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
      .get(`/client/get-treatments-with-config-by-sets?key=${key}&set-names=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key&bucketing-key=&set-names=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key&bucketing-key=    &set-names=test')
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
      .get(`/client/get-treatments-with-config-by-sets?key=key&bucketing-key=${key}&set-names=test`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if set-names is not passed', async (done) => {
    const expected = [
      'you passed a null or undefined set-names, set-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if set-names is empty', async (done) => {
    const expected = [
      'you passed an empty set-names, set-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&set-names=')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if set-names is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty set-names, set-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&set-names=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are errors in key and set-names', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty set-names, set-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=&set-names=    ')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is invalid', async (done) => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=test&set-names=my-experiment&attributes=lalala')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty set-names, set-names must be a non-empty array.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=     &set-names=&attributes="lalala"')
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors in every input', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty set-names, set-names must be a non-empty array.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments-with-config-by-sets?bucketing-key=${key}&key=     &set-names=&attributes="lalala"`)
      .set('Authorization', 'key_green');
    expectErrorContaining(response, 400, expected);
    done();
  });

  const expectedGreenResults = {
    'test_green': {
      treatment: 'on',
    },
    'test_color': {
      treatment: 'on',
    },
    'test_green_config': {
      treatment: 'on',
      config: '{"color":"green"}',
    },
  };
  const expectedPurpleResults = {
    'test_purple': {
      treatment: 'on',
    },
    'test_color': {
      treatment: 'on',
    },
    'test_purple_config': {
      treatment: 'on',
      config: '{"color":"purple"}',
    },
  };
  const expectedPinkResults = {
    'test_purple': {
      treatment: 'on',
    },
    'test_green': {
      treatment: 'on',
    },
    'test_color': {
      treatment: 'on',
    },
    'test_purple_config': {
      treatment: 'on',
      config: '{"color":"purple"}',
    },
    'test_green_config': {
      treatment: 'on',
      config: '{"color":"green"}',
    },
  };

  test('should be 200 if is valid attributes (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&set-names=set_green&attributes={"test":"test"}')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 when attributes is null (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&set-names=set_green')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 if is valid attributes (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments-with-config-by-sets?key=key_green&set-names=set_green')
      .send({attributes: { test:'test' }})
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 if is valid attributes stringified (POST)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&set-names=set_green&attributes={"test":"test"}')
      .send(JSON.stringify({attributes: { test:'test' }}))
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 when attributes is null (POST)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&set-names=set_green')
      .send({
        attributes: null,
      })
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_green&set-names=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_green');
    expectOkMultipleResults(response, 200, expectedGreenResults, 3);
    done();
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_purple&set-names=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_purple');
    expectOkMultipleResults(response, 200, expectedPurpleResults, 3);
    done();
  });

  test('should be 200 with multiple evaluation but evualuate configured flag sets', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments-with-config-by-sets?key=key_purple&set-names=set_green,set_purple,nonexistant-experiment')
      .set('Authorization', 'key_pink');
    expectOkMultipleResults(response, 200, expectedPinkResults, 5);
    done();
  });
});
