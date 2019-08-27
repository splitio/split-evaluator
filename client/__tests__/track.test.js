process.env.SPLITIO_EXT_API_KEY = 'test';
process.env.SPLITIO_API_KEY = 'localhost';

const request = require('supertest');
const app = require('../../app');
const { expectError, expectErrorContaining, getLongKey } = require('../../utils/testWrapper/index');

describe('track', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/track?key=test&event-type=my-event&traffic-type=my-traffic&value=1');
    expectError(response, 401, 'Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/track?key=test&event-type=my-event&traffic-type=my-traffic&value=1')
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
      .get('/track?event-type=my-event&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/track?key=&event-type=my-event&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/track?key=     &event-type=my-event&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/track?key=${key}&event-type=my-event&traffic-type=my-traffic&value=1`)    
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if event-type is not passed', async () => {
    const expected = [
      'you passed a null or undefined event-type, event-type must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if event-type is empty', async () => {
    const expected = [
      'you passed an empty event-type, event-type must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if event-type not accomplish regex', async () => {
    const expected = [
      'you passed "@!test", event-type must adhere to the regular expression /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/g. This means an event_type must be alphanumeric, cannot be more than 80 characters long, and can only include a dash, underscore, period, or colon as separators of alphanumeric characters.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=@!test&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if traffic-type is not passed', async () => {
    const expected = [
      'you passed a null or undefined traffic-type, traffic-type must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if traffic-type is empty', async () => {
    const expected = [
      'you passed an empty traffic-type, traffic-type must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=&value=1')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if value is empty', async () => {
    const expected = [
      'value must be null or number.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic&value=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if value is empty', async () => {
    const expected = [
      'value must be null or number.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic&value=')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if value is NaN', async () => {
    const expected = [
      'value must be null or number.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic&value=not-number')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if properties is invalid', async () => {
    const expected = [
      'properties must be a plain object.'
    ];
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic&value=1&properties=lalala')
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 400 if there are multiple errors in every input', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.',
      'you passed "@!test", event-type must adhere to the regular expression /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/g. This means an event_type must be alphanumeric, cannot be more than 80 characters long, and can only include a dash, underscore, period, or colon as separators of alphanumeric characters.',
      'you passed an empty traffic-type, traffic-type must be a non-empty string.',
      'properties must be a plain object.',
      'value must be null or number.'
    ];
    const key = getLongKey();
    const response = await request(app)
      .get(`/track?key=${key}&event-type=@!test&traffic-type=&value=invalid&properties=invalid`)
      .set('Authorization', 'test');
    expectErrorContaining(response, 400, expected);
  });

  test('should be 200 if properties is null', async () => {
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic&value=1')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
  });

  test('should be 200 if value and properties are null', async () => {
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
  });

  test('should be 200 if value is null and properties is valid', async () => {
    const response = await request(app)
      .get('/track?key=my-key&event-type=my-event&traffic-type=my-traffic&properties={"prop1":3}')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
  });
});
