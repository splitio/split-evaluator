
const request = require('supertest');
const app = require('../../app');

describe('get-treatment', () => {
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment');
    expect(response.statusCode).toBe(401);
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'invalid');
    expect(response.statusCode).toBe(401);
  });

  test('should be 400 if key is not passed', async () => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?split-name=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-name is not passed', async () => {
    const expected = [
      'you passed a null or undefined split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-name is empty', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-name is invalid', async () => {
    const expected = [
      'you passed an invalid split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=[]')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment&attributes="lalala"')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('errors');
    expect(response.body.errors).toEqual(expect.arrayContaining(expected));
  });

  test('should be 200 if is valid attributes', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('splitName', 'my-experiment');
    expect(response.body).toHaveProperty('treatment', 'on');
  });

  test('should be 200 if auth is valid', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('splitName', 'my-experiment');
    expect(response.body).toHaveProperty('treatment', 'on');
  });
});