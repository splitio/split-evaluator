const request = require('supertest');

describe('CORS ', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('', async () => {
    process.env.SPLIT_EVALUATOR_ENABLE_CORS = true;
    const app = require('../app');
    const { headers } = await request(app).get('/');
    expect(headers['access-control-allow-origin']).toEqual('*');
  });

  test('default', async () => {
    delete process.env.SPLIT_EVALUATOR_ENABLE_CORS;
    const app = require('../app');
    const { headers } = await request(app).get('/');
    expect(headers['access-control-allow-origin']).toEqual(undefined);
  });

});
