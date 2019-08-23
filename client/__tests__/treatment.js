
const request = require('supertest');
const app = require('../../app');

describe('get-treatment', () => {
  test('should be 401 if auth is not passed', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment');
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  test('should be 401 if auth does not match', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'invalid');
    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Unauthorized');
  });

  test('should be 400 if key is not passed', async () => {
    const expected = [
      'you passed a null or undefined key, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?split-name=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if key is empty', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=&split-name=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=     &split-name=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if key is too long', async () => {
    const expected = [
      'key too long, key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/get-treatment?key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });


  test('should be 400 if bucketing-key is empty', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=key&bucketing-key=&split-name=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if bucketing-key is empty trimmed', async () => {
    const expected = [
      'you passed an empty string, bucketing-key must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=key&bucketing-key=    &split-name=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if bucketing-key is too long', async () => {
    const expected = [
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/get-treatment?key=key&bucketing-key=${key}&split-name=test`)
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-name is not passed', async () => {
    const expected = [
      'you passed a null or undefined split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-name is empty', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if split-name is empty trimmed', async () => {
    const expected = [
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=    ')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if there are errors in key and split-name', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=&split-name=    ')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment&attributes=lalala')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if attributes is invalid', async () => {
    const expected = [
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment&attributes="lalala"')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if there are multiple errors', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.',
      'attributes must be a plain object.'
    ];
    const response = await request(app)
      .get('/get-treatment?key=     &split-name=&attributes="lalala"')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 400 if there are multiple errors in every input', async () => {
    const expected = [
      'you passed an empty string, key must be a non-empty string.',
      'you passed an empty split-name, split-name must be a non-empty string.',
      'attributes must be a plain object.',
      'bucketing-key too long, bucketing-key must be 250 characters or less.'
    ];
    let key = '';
    for (let i = 0; i <=250; i++) {
      key += 'a';
    }
    const response = await request(app)
      .get(`/get-treatment?bucketing-key=${key}&key=     &split-name=&attributes="lalala"`)
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toEqual(expect.arrayContaining(expected));
  });

  test('should be 200 if is valid attributes', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment&attributes={"test":"test"}')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(response.body.evaluation).toHaveProperty('treatment', 'on');
    expect(response.body.evaluation).toHaveProperty('splitName', 'my-experiment');
  });

  test('should be 200 if auth is valid', async () => {
    const response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(response.body.evaluation).toHaveProperty('treatment', 'on');
    expect(response.body.evaluation).toHaveProperty('splitName', 'my-experiment');
  });

  test('should be 200 with multiple experiments', async () => {
    let response = await request(app)
      .get('/get-treatment?key=test&split-name=my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(response.body.evaluation).toHaveProperty('treatment', 'on');
    expect(response.body.evaluation).toHaveProperty('splitName', 'my-experiment');
    response = await request(app)
      .get('/get-treatment?key=only_test&split-name=my-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(response.body.evaluation).toHaveProperty('treatment', 'off');
    expect(response.body.evaluation).toHaveProperty('splitName', 'my-experiment');
    response = await request(app)
      .get('/get-treatment?key=test&split-name=other-experiment-3')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(response.body.evaluation).toHaveProperty('treatment', 'off');
    expect(response.body.evaluation).toHaveProperty('splitName', 'other-experiment-3');
    response = await request(app)
      .get('/get-treatment?key=only_test&split-name=nonexistant-experiment')
      .set('Authorization', 'test');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('evaluation');
    expect(response.body.evaluation).toHaveProperty('treatment', 'control');
    expect(response.body.evaluation).toHaveProperty('splitName', 'nonexistant-experiment');
  });
});
