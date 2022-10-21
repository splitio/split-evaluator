const request = require('supertest');
const { expectOk, gracefulShutDown } = require('../../utils/testWrapper/index');

describe('ip addresses', () => {
  let ip;
  let hostname;

  const log = (impressionData) => {
    ip = impressionData.ip;
    hostname = impressionData.hostname;
  };

  const mockListener = () => {
    const environmentManager = require('../../environmentManager').getInstance();
    environmentManager.getAuthTokens().forEach(authToken => {
      environmentManager.getFactory(authToken).settings.impressionListener.logImpression = log;
    });
  };

  process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'http://localhost:7546';

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(async () => {
    await gracefulShutDown();
  });

  describe('ip addresses default', () => {
    test('should set hostname and ip when is default', async (done) => {
      const app = require('../../app');
      const os = require('os');
      const localIp = require('@splitsoftware/splitio/lib/utils/ip');
      mockListener();
      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expectOk(response, 200, 'on', 'my-experiment');
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(ip).toBe(localIp.address());
      expect(hostname).toBe(os.hostname());
      done();
    });
  });

  describe('ip addresses disabled', () => {
    beforeEach(() => {
      process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = 'false';
    });
    test('should not set hostname and ip when is false', async (done) => {
      const app = require('../../app');

      mockListener();

      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expectOk(response, 200, 'on', 'my-experiment');
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(ip).toBe(false);
      expect(hostname).toBe(false);
      done();
    });
  });

  describe('ip addresses enabled', () => {
    beforeEach(() => {
      process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = 'true';
    });
    test('should set hostname and ip when is true', async (done) => {
      const app = require('../../app');
      const os = require('os');
      const localIp = require('@splitsoftware/splitio/lib/utils/ip');
      mockListener();

      const response = await request(app)
        .get('/client/get-treatment?key=test&split-name=my-experiment')
        .set('Authorization', 'test');
      expectOk(response, 200, 'on', 'my-experiment');
      await new Promise(resolve => setTimeout(resolve, 100));
      expect(ip).toBe(localIp.address());
      expect(hostname).toBe(os.hostname());
      done();
    });
  });
});
