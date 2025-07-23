const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, expectOkAllTreatments, getLongKey } = require('../../utils/testWrapper');

describe('get-all-treatments-with-config', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"}]');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"}]')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
  });

  // Testing Input Validation.
  // The following tests are going to check null parameters, wrong types or lengths.
  test('should be 400 if keys is not passed', async () => {
    const expected = [
      'you passed null or undefined keys, keys must be a non-empty array.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is empty', async () => {
    const expected = [
      'keys must be a valid format.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is not an array', async () => {
    const expected = [
      'keys must be a valid format.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys={}')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is an empty array', async () => {
    const expected = [
      'there should be at least one matchingKey-trafficType element.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is an invalid array', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[1, 2, 3, 4]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is missing trafficType', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"my-key"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending invalid trafficType', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"my-key", "trafficType":true}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending empty trafficType', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"my-key", "trafficType":""}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is missing matchingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending an invalid matchingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":true,"trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending an empty matchingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"","trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending an empty matchingKey when is trimmed', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"    ","trafficType":"my-tt"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending a long matchingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-all-treatments-with-config?keys=[{"matchingKey":"${key}","trafficType":"my-tt"}]`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending an invalid bucketingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"my-key", "trafficType":"my-tt", "bucketingKey":[]}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending an empty bucketingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"my=key","trafficType":"my-tt", "bucketingKey":""}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending an empty bucketingKey when is trimmed', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"my-key","trafficType":"my-tt", "bucketingKey":"   "}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if keys is sending a long bucketingKey', async () => {
    const expected = [
      'keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/client/get-all-treatments-with-config?keys=[{"matchingKey":"my-key", "bucketingKey":"${key}","trafficType":"my-tt"}]`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":12345,"trafficType":"localhost"}]&attributes=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if tt is duplicated', async () => {
    const expected = [
      'at least one trafficType is duplicated in keys object.'
    ];
    const response = await request(app)
      .get('/client/get-all-treatments?keys=[{"matchingKey":"my-key","trafficType":"localhost"},{"matchingKey":"my-key-2","trafficType":"localhost2"},{"matchingKey":"my-key","trafficType":"localhost"}]')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  // Testing number convertion for matchingKey
  test('should be 200 if matching key passes a number', async () => {
    const expected = {
      localhost: {
        'my-experiment': {
          treatment: 'control',
          config: null,
        },
        'other-experiment-3': {
          treatment: 'off',
          config: null,
        },
        'other-experiment': {
          treatment: 'control',
          config: null,
        },
        'other-experiment-2': {
          treatment: 'on',
          config: null,
        },
      },
    };
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":12345,"trafficType":"localhost"}]')
      .set('Authorization', 'test');
    expectOkAllTreatments(response, 200, expected, 1);
  });

  // Testing YML evaluations
  test('should be 200 if keys is valid', async () => {
    const expected = {
      localhost: {
        'my-experiment': {
          treatment: 'on',
          config: '{"desc" : "this applies only to ON treatment"}',
        },
        'other-experiment-3': {
          treatment: 'off',
          config: null,
        },
        'other-experiment': {
          treatment: 'control',
          config: null,
        },
        'other-experiment-2': {
          treatment: 'on',
          config: null,
        },
      },
      account: {},
    };
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"},{"matchingKey":"test","trafficType":"account"}]')
      .set('Authorization', 'test');
    expectOkAllTreatments(response, 200, expected, 2);
  });

  test('should be 200 if properties is valid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"}]&properties={"package":"premium","admin":true,"discount":50}')
      .set('Authorization', 'test');
    expect(response.status).toBe(200);
  });

  test('should be 200 if properties is valid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"}]')
      .send({
        properties: { package: 'premium', admin: true, discount: 50 },
      })
      .set('Authorization', 'test');
    expect(response.status).toBe(200);
  });

  test('should be 200 if properties is invalid (GET)', async () => {
    const response = await request(app)
      .get('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"}]&properties={"foo": {"bar": 1}}')
      .set('Authorization', 'test');
    expect(response.status).toBe(200);
  });

  test('should be 200 if properties is invalid (POST)', async () => {
    const response = await request(app)
      .post('/client/get-all-treatments-with-config?keys=[{"matchingKey":"test","trafficType":"localhost"}]')
      .send({
        properties: { foo: { bar: 1 } },
      })
      .set('Authorization', 'test');
    expect(response.status).toBe(200);
  });
});
