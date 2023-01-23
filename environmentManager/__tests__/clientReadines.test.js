// Environment configurations
const threeReady = JSON.stringify([
  { API_KEY: 'localhost', AUTH_TOKEN: 'ready1' },
  { API_KEY: 'apikey1', AUTH_TOKEN: 'ready2' },
  { API_KEY: 'apikey2', AUTH_TOKEN: 'ready3' }
]);

const twoReadyOneTimedOut = JSON.stringify([
  { API_KEY: 'localhost', AUTH_TOKEN: 'ready1' },
  { API_KEY: 'apikey1', AUTH_TOKEN: 'ready2' },
  { API_KEY: 'timeout', AUTH_TOKEN: 'timedOut' }
]);

const oneReadyTwoTimedOut = JSON.stringify([
  { API_KEY: 'localhost', AUTH_TOKEN: 'ready1' },
  { API_KEY: 'timeout', AUTH_TOKEN: 'timedOut1' },
  { API_KEY: 'timeout', AUTH_TOKEN: 'timedOut2' }
]);

const threeTimedOut = JSON.stringify([
  { API_KEY: 'timeout', AUTH_TOKEN: 'timedOut1' },
  { API_KEY: 'timeout', AUTH_TOKEN: 'timedOut2' },
  { API_KEY: 'timeout', AUTH_TOKEN: 'timedOut3' }
]);

// Mock fetch to response 404 to any http request
jest.mock('node-fetch', () => {
  return jest.fn().mockImplementation(() => {
    return Promise.reject({ response: { status: 404, response: 'response'}});
  });
});

// Test environmentManager client readiness
describe('environmentManager',  () => {

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  afterAll(() => {
    // Unmock fetch
    jest.unmock('node-fetch');
  });

  describe('clientReadiness',  () => {

    // If at least one client is ready, environmentManager.ready() should return true to initialize evaluator
    test('Three clients ready', (done) => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS=threeReady;
      const environmentManagerFactory = require('../');
      const environmentManager = environmentManagerFactory.getInstance();
      environmentManager.ready().then(ready => {
        expect(ready).toBe(true);
        expect(environmentManager.getClient('ready1').isClientReady).toBe(true);
        expect(environmentManager.getClient('ready2').isClientReady).toBe(true);
        expect(environmentManager.getClient('ready3').isClientReady).toBe(true);
        done();
      });
    });

    // If at least one client is ready, environmentManager.ready() should return true to initialize evaluator
    test('Two clients ready, one timed out', (done) => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS=twoReadyOneTimedOut;
      const environmentManagerFactory = require('../');
      const environmentManager = environmentManagerFactory.getInstance();
      environmentManager.ready().then(ready => {
        expect(ready).toBe(true);
        expect(environmentManager.getClient('ready1').isClientReady).toBe(true);
        expect(environmentManager.getClient('ready2').isClientReady).toBe(true);
        expect(environmentManager.getClient('timedOut').isClientReady).toBe(false);
        done();
      });
    });

    // If at least one client is ready, environmentManager.ready() should return true to initialize evaluator
    test('One client ready, two timed out', (done) => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS=oneReadyTwoTimedOut;
      const environmentManagerFactory = require('../');
      const environmentManager = environmentManagerFactory.getInstance();
      environmentManager.ready().then(ready => {
        expect(ready).toBe(true);
        expect(environmentManager.getClient('ready1').isClientReady).toBe(true);
        expect(environmentManager.getClient('timedOut1').isClientReady).toBe(false);
        expect(environmentManager.getClient('timedOut2').isClientReady).toBe(false);
        done();
      });
    });

    // If every client timed out, environmentManager.ready() should return false to avoid evaluator initialization
    test('Three clients timed out', (done) => {
      delete process.env.SPLIT_EVALUATOR_ENVIRONMENTS;
      process.env.SPLIT_EVALUATOR_ENVIRONMENTS=threeTimedOut;
      const environmentManagerFactory = require('../');
      const environmentManager = environmentManagerFactory.getInstance();
      environmentManager.ready().then(ready => {
        expect(ready).toBe(false);
        expect(environmentManager.getClient('timedOut1').isClientReady).toBe(false);
        expect(environmentManager.getClient('timedOut2').isClientReady).toBe(false);
        expect(environmentManager.getClient('timedOut3').isClientReady).toBe(false);
        done();
      });
    });
  });
});