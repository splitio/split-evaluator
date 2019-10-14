

const request = require('supertest');
const { expectOk } = require('../../utils/testWrapper/index');

describe('ip addresses', () => {
  let ip;
  let hostname;

  const log = (impressionData) => {
    ip = impressionData.ip;
    hostname = impressionData.hostname;
  };

  beforeEach(() => {
    jest.resetModules();
  });

  describe('ip addresses default', () => {
    test('should set hostname and ip when is default', async (done) => {
      process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
      process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';
      process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'http://localhost:7546';
      const app = require('../../app');
      const os = require('os');
      const localIp = require('ip');
  
      const sdkModule = require('../../sdk');
      sdkModule.factory.settings.impressionListener.logImpression = log;
  
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
    test('should not set hostname and ip when is false', async (done) => {
      process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
      process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';
      process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'http://localhost:7546';
      process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = 'false';
      const app = require('../../app');

      const sdkModule = require('../../sdk');
      sdkModule.factory.settings.impressionListener.logImpression = log;

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
    test('should set hostname and ip when is true', async (done) => {
      process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
      process.env.SPLIT_EVALUATOR_API_KEY = 'localhost';
      process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'http://localhost:7546';
      process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = 'true';
      const app = require('../../app');
      const os = require('os');
      const localIp = require('ip');
  
      const sdkModule = require('../../sdk');
      sdkModule.factory.settings.impressionListener.logImpression = log;
  
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
