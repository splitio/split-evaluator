process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkMultipleResults, getLongKey } = require('../../utils/testWrapper');

describe('get-treatments', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=my-experiment');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=my-experiment')
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
      .get('/client/get-treatments?split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=&split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=     &split-names=test')
      .set('Authorization', 'test');
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
      .get(`/client/get-treatments?key=${key}&split-names=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=key&bucketing-key=&split-names=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if bucketing-key is empty trimmed', async (done) => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=key&bucketing-key=    &split-names=test')
      .set('Authorization', 'test');
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
      .get(`/client/get-treatments?key=key&bucketing-key=${key}&split-names=test`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-names is not passed', async (done) => {
    const expected = [
      'you passed a null or undefined split-names, split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=test')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-names is empty', async (done) => {
    const expected = [
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if split-names is empty trimmed', async (done) => {
    const expected = [
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are errors in key and split-names', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=&split-names=    ')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is invalid', async (done) => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-treatments?key=     &split-names=&attributes="lalala"')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if there are multiple errors in every input', async (done) => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'split-names must be a non-empty array.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-treatments?bucketing-key=${key}&key=     &split-names=&attributes="lalala"`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
    done();
  });

  test('should be 400 if attributes is an invalid json (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments?key=test&split-name=my-experiment')
      .set('Content-Type', 'application/json')
      .send('\|\\\"/regex/i') // Syntax error parsing the JSON.
      .set('Authorization', 'test');
    expectError(response, 400);
    expect(response.body.error.type).toBe('entity.parse.failed'); // validate the error
    done();
  });

  test('should be 200 if is valid attributes (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
      },
    }, 1);
    done();
  });

  test('should be 200 when attributes is null (GET)', async (done) => {
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
      },
    }, 1);
    done();
  });

  test('should be 200 if is valid attributes (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments?key=test&split-names=my-experiment')
      .set('Authorization', 'test')
      .send({
        attributes: {test:'test'},
      });
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
      },
    }, 1);
    done();
  });

  test('should be 200 if is valid attributes as string (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments?key=test&split-names=my-experiment')
      .send(JSON.stringify({
        attributes: {test:'test'},
      }))
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
      },
    }, 1);
    done();
  });

  test('should be 200 if attributes is null (POST)', async (done) => {
    const response = await request(app)
      .post('/client/get-treatments?key=test&split-names=my-experiment,my-experiment')
      .send({
        attributes: null,
      })
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
      },
    }, 1);
    done();
  });

  // Testing Multiple Experiments Regarding YAML
  test('should be 200 with multiple evaluation', async (done) => {
    // Checking multiple experiments regarding yml passed
    const response = await request(app)
      .get('/client/get-treatments?key=test&split-names=my-experiment,other-experiment-3,my-experiment,nonexistant-experiment')
      .set('Authorization', 'test');
    expectOkMultipleResults(response, 200, {
      'my-experiment': {
        treatment: 'on',
      },
      'other-experiment-3': {
        treatment: 'off',
      },
      'nonexistant-experiment': {
        treatment: 'control',
      },
    }, 3);
    done();
  });
});