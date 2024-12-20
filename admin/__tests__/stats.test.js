const request = require('supertest');
const { expectError } = require('../../utils/testWrapper/index');
const utils = require('../../utils/utils');
const { apiKeyMocksMap } = require('../../utils/mocks');

jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.reject({ response: { status: 404, response: 'response' } });
  });
});
describe('stats', () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Unmock fetch
    jest.unmock('node-fetch');
  });

  describe('stats', () => {


    const environments = JSON.parse(process.env.SPLIT_EVALUATOR_ENVIRONMENTS);

    // Testing authorization
    test('should be 401 if auth is not passed', async () => {
      const app = require('../../app');
      const response = await request(app)
        .get('/admin/stats');
      expectError(response, 401, 'Unauthorized');
    });

    test('should be 401 if auth does not match', async () => {
      const app = require('../../app');
      const response = await request(app)
        .get('/admin/stats')
        .set('Authorization', 'invalid');
      expectError(response, 401, 'Unauthorized');
    });

    test('uptime and healthcheck', async () => {
      const app = require('../../app');
      const version = utils.getVersion();
      const environmentManager = require('../../environmentManager').getInstance();
      const parts = environmentManager.getVersion().split('-');
      const sdkLanguage = parts[0];
      const sdkVersion = parts.slice(1).join('-');

      const response = await request(app)
        .get('/admin/stats')
        .set('Authorization', 'key_blue');
      expect(response.statusCode).toEqual(200);
      const stats = response.body;
      expect(stats.uptime).toEqual(utils.uptime());
      expect(stats.healthcheck).toEqual({
        version: version,
        sdk: sdkLanguage,
        sdkVersion: sdkVersion,
      });
    });

    test('ready environment stats', async () => {
      const environmentManager = require('../../environmentManager').getInstance();
      const app = require('../../app');
      const response = await request(app)
        .get('/admin/stats')
        .set('Authorization', 'test');
      expect(response.statusCode).toEqual(200);
      const stats = response.body;
      environments.forEach(environment => {
        const authToken = environment.AUTH_TOKEN;
        const apiKey = environment.API_KEY;
        const mock = apiKeyMocksMap[apiKey];
        if (!mock) return;
        expect(stats.environments[utils.obfuscate(authToken)]).toEqual({
          splitCount: mock.splitNames.length,
          segmentCount: mock.segments.length,
          ready: true,
          timeUntilReady: mock.timeUntilReady,
          lastSynchronization: environmentManager._reword(mock.lastSynchronization),
          httpErrors: environmentManager._reword(mock.httpErrors),
          impressionsMode: 'OPTIMIZED',
        });
      });
    });

    test('stats for two environments where one is timed out', async () => {
      // Environment configurations
      const environmentsConfig = [
        { API_KEY: 'test1', AUTH_TOKEN: 'timedout' },
        { API_KEY: 'apikey1', AUTH_TOKEN: 'key_blue' }
      ];
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS = JSON.stringify(environmentsConfig);
      process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = JSON.stringify({
        sync: {
          impressionsMode: 'NONE',
        },
      });
      const app = require('../../app');
      const environmentManager = require('../../environmentManager').getInstance();

      let response = await request(app)
        .get('/admin/stats')
        .set('Authorization', 'key_blue');
      expect(response.statusCode).toEqual(200);
      let stats = response.body;
      environmentsConfig.forEach(envConfig => {
        const authToken = envConfig.AUTH_TOKEN;
        const apiKey = envConfig.API_KEY;
        let mock = apiKeyMocksMap[apiKey];
        // if there is not a mock it works as timed out
        if (!mock) {
          mock = {
            splitNames: [],
            segments: [],
            timeUntilReady: 0,
            lastSynchronization: {},
            httpErrors: { te: { 401: 1 } },
          };
        }
        const environment = environmentManager.getEnvironment(authToken);
        expect(stats.environments[utils.obfuscate(authToken)]).toEqual({
          splitCount: mock.splitNames.length,
          segmentCount: mock.segments.length,
          ready: environment.isClientReady,
          timeUntilReady: mock.timeUntilReady,
          lastSynchronization: environmentManager._reword(mock.lastSynchronization),
          httpErrors: environmentManager._reword(mock.httpErrors),
          impressionsMode: 'NONE',
          lastEvaluation: environment.lastEvaluation,
        });

      });
      response = await request(app)
        .get('/client/get-treatment?key=test&split-name=testing_split_blue')
        .set('Authorization', 'key_blue');

      expect(response.statusCode).toEqual(200);
      response = await request(app)
        .get('/admin/stats')
        .set('Authorization', 'key_blue');
      expect(response.statusCode).toEqual(200);
      stats = response.body;
      const lastEvaluation = stats.environments[utils.obfuscate('key_blue')].lastEvaluation;
      expect(lastEvaluation).not.toBe(undefined);
      expect(lastEvaluation).toBe(environmentManager.getEnvironment('key_blue').lastEvaluation);

    });
  });
});
