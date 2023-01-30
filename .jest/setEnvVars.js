// Environments for testing
process.env.SPLIT_EVALUATOR_ENVIRONMENTS='[{"API_KEY":"localhost","AUTH_TOKEN":"test"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"},{"API_KEY":"apikey2","AUTH_TOKEN":"key_red"}]'

// Before all tests, sdk module is mocked to create a wrapper where a different yaml file is assigned to each environment
// sdk factory mock to set a different yaml for each apikey and localhost mode
jest.mock('../sdk', () => ({
  getSplitFactory: jest.fn((settings) => {
    const { __dirname } = require('../utils/utils');
    const path = require('path');
    const { apiKeyMocksMap } = require('../utils/mocks')

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
    const { factory, telemetry, impressionsMode } = sdk.getSplitFactory(configForMock);

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