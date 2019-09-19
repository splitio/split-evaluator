process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';

const utils = require('../../utils/utils');
const sdkModule = require('../../sdk');
const sdk = sdkModule.factory;

const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');

describe('version', () => {
  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/admin/version');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/admin/version')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200', async (done) => {
    const response = await request(app)
      .get('/admin/version')
      .set('Authorization', 'test');
    const version = utils.getVersion();
    const parts = sdk.settings.version.split('-');
    const sdkLanguage = parts[0];
    const sdkVersion = parts.slice(1).join('-');
    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty('sdk', sdkLanguage);
    expect(response.body).toHaveProperty('sdkVersion', sdkVersion);
    expect(response.body).toHaveProperty('version', version);
    done();
  });
});
