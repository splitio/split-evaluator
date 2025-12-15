// Environments for testing
process.env.SPLIT_EVALUATOR_ENVIRONMENTS = `[
  {"API_KEY":"localhost","AUTH_TOKEN":"test"},
  {"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"},
  {"API_KEY":"apikey2","AUTH_TOKEN":"key_red"},
  {"API_KEY":"apikey3","AUTH_TOKEN":"key_green","FLAG_SET_FILTER":"set_green"},
  {"API_KEY":"apikey4","AUTH_TOKEN":"key_purple","FLAG_SET_FILTER":"set_purple"},
  {"API_KEY":"apikey5","AUTH_TOKEN":"key_pink","FLAG_SET_FILTER":"set_green,set_purple"}
]`;

// Before all tests, sdk module is mocked to create a wrapper where a different yaml file is assigned to each environment
// sdk factory mock to set a different yaml for each apikey and localhost mode
jest.mock('../sdk', () => ({
  getSplitFactory: jest.fn((settings) => {
    const { __dirname } = require('../utils/utils');
    const path = require('path');
    const { apiKeyMocksMap } = require('../utils/mocks');
    const { syncManagerOfflineFactory } = require('@splitsoftware/splitio-commons/cjs/sync/offline/syncManagerOffline');
    const { splitsParserFromFileFactory } = require('../sdk/sync/splitsParserFromFile');
    // Clients are configured in localhost mode if there is a features file maped to the authorizationKey value in mocksMap

    let features = '';
    let authorizationKey = settings.core.authorizationKey;
    let error = { te: { 401: 1 } };

    const mock = apiKeyMocksMap[settings.core.authorizationKey]

    // if authorizationKey has a feature file maped in mocksMap
    if (mock) {
      // Set feature file
      features = path.join(__dirname, mock.splitUrl);
      // Set mode to localhost
      authorizationKey = 'localhost'
      // Set mockError
      error = {}
    };

    const configForMock = {
      ...settings,
      core: {
        ...settings.core,
        authorizationKey: authorizationKey,
      },
      urls: {
        sdk: 'https://sdk.test.io/api',
        events: 'https://events.test.io/api',
        auth: 'https://auth.test.io/api',
        streaming: 'https://streaming.test.io',
        telemetry: 'https://telemetry.test.io/api',
      },
      startup: {
        readyTimeout: 1,
      },
      features: features,
      scheduler: {
        ...settings.scheduler,
        featuresRefreshRate: 1,
        segmentsRefreshRate: 1,
        impressionsRefreshRate: 30000
      },
      streamingEnabled: false
    };

    let sdk = jest.requireActual('../sdk');
    
    const moduleOverrider = (modules) => {
      if (features) {
        modules.splitApiFactory = undefined;
        modules.syncManagerFactory = syncManagerOfflineFactory(splitsParserFromFileFactory)
        modules.SignalListener = undefined;
      }
    };

    const { factory, impressionsMode } = sdk.getSplitFactory(configForMock, moduleOverrider);

    const mockedTelemetry = {
      splits: {
        getSplitNames: () => mock ? mock.splitNames : []
      },
      segments: {
        getRegisteredSegments: () => mock ? mock.segments : []
      },
      getLastSynchronization: () => mock ? mock.lastSynchronization : {},
      getTimeUntilReady: () => mock ? mock.timeUntilReady : 0,
      httpErrors: error,
    }

    return { factory, telemetry: mockedTelemetry, impressionsMode };
  }),
}));