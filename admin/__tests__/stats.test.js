const request = require('supertest');
const app = require('../../app');
const { expectError } = require('../../utils/testWrapper/index');
const utils = require('../../utils/utils');
const environmentManager = require('../../environmentManager').getInstance();


describe('stats', () => {

  const authTokens = [
    'test',
    'key_blue',
    'key_red'
  ];

  const version = utils.getVersion();
  const parts = environmentManager.getVersion().split('-');
  const sdkLanguage = parts[0];
  const sdkVersion = parts.slice(1).join('-');

  // Testing authorization
  test('should be 401 if auth is not passed', async (done) => {
    const response = await request(app)
      .get('/admin/stats');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 401 if auth does not match', async (done) => {
    const response = await request(app)
      .get('/admin/stats')
      .set('Authorization', 'invalid');
    expectError(response, 401, 'Unauthorized');
    done();
  });

  test('should be 200', async (done) => {
    const response = await request(app)
      .get('/admin/stats')
      .set('Authorization', 'test');
    expect(response.statusCode).toEqual(200);
    const stats = response.body;
    expect(stats.uptime).toEqual(utils.uptime());
    expect(stats.healthcheck).toEqual({
      version: version,
      sdk: sdkLanguage,
      sdkVersion: sdkVersion,
    });
    authTokens.forEach(authToken => {
      expect(stats.environments[authToken]).toEqual({
        splits: [],
        segments: [],
        ready: true,
        impressionsMode: 'OPTIMIZED',
      });
    });
    done();
  });
});
