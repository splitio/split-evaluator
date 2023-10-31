
const { core, scheduler, storage, urls, startup, sync, integrations }  = require('../../utils/mocks');

// Environment configurations
const environmentsConfig = [
  { API_KEY: 'test1', AUTH_TOKEN: 'ready2' },
  { API_KEY: 'test2', AUTH_TOKEN: 'ready3' }
];

// Mock fetch to response 404 to any http request
jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.reject({ response: { status: 404, response: 'response'}});
  });
});

// Test environmentManager global config
describe('environmentManager',  () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Unmock fetch
    jest.unmock('node-fetch');
  });

  describe('global config',  () => {

    process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = JSON.stringify({
      core: core,
      scheduler: scheduler,
      storage: storage,
      urls: urls,
      startup: startup,
      sync: sync,
      mode: 'consumer',
      debug: false,
      streamingEnabled: false,
      integrations: integrations,
    });

    test('', async () => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS=JSON.stringify(environmentsConfig);
      const environmentManagerFactory = require('../');
      const environmentManager = environmentManagerFactory.getInstance();
      environmentsConfig.forEach(environment => {
        const factorySettings = environmentManager.getFactory(environment.AUTH_TOKEN).settings;
        // Authorization key should be the one on environments config
        expect(factorySettings.core.authorizationKey).toBe(environment.API_KEY);
        // IPAddressesEnabled can be configured only with SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED
        expect(factorySettings.core.IPAddressesEnabled).toBe(true);
        // Mode should be always standalone
        expect(factorySettings.mode).toBe('standalone');
        // Sync should be always enabled
        expect(factorySettings.sync.enabled).toBe(true);
        // Integrations should be always removed
        expect(factorySettings.integrations).toBe(undefined);
        // Storage should be always MEMORY
        expect(factorySettings.storage.type).toBe('MEMORY');
        // impressionsMode should be NONE as configured in global config
        expect(factorySettings.sync.impressionsMode).toBe('NONE');
      });
      await environmentManagerFactory.destroy();
    });
  });

  describe('flag sets',  () => {
    test('Environment manager should initialize for legacy configuration without filters', async () => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_AUTH_TOKEN = 'test';
      process.env.SPLIT_EVALUATOR_API_KEY = 'test';
      const environmentManagerFactory = require('../');
      expect(() => environmentManagerFactory.getInstance()).not.toThrow();
      expect(environmentManagerFactory.hasInstance()).toBe(true);
      await environmentManagerFactory.destroy();
    });

    test('Environment manager should throw an error if is initialized with environments and filters on global config', async () => {
      process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = JSON.stringify({
        urls: urls,
        sync: {
          splitFilters: [{type: 'bySet', values: ['set_a', 'set_b']}],
        },
      });
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS = JSON.stringify(environmentsConfig);
      expect(() => require('../')).toThrow();
    });

    test('Environment manager should initialize for legacy configuration with filters', async () => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = JSON.stringify({
        urls: urls,
        sync: {
          splitFilters: [{type: 'bySet', values: ['set_a', 'set_b']}],
        },
      });

      const environmentManagerFactory = require('../');
      const environmentManager = environmentManagerFactory.getInstance();
      const factorySettings = environmentManager.getFactory(process.env.SPLIT_EVALUATOR_AUTH_TOKEN).settings;
      expect(factorySettings.sync.splitFilters).toEqual([{type: 'bySet', values: ['set_a', 'set_b']}]);
      await environmentManagerFactory.destroy();
    });
  });
});
