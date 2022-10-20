// Environments for testing
process.env.SPLIT_EVALUATOR_ENVIRONMENTS='[{"API_KEY":"localhost","AUTH_TOKEN":"test"},{"API_KEY":"apikey1","AUTH_TOKEN":"key_blue"},{"API_KEY":"apikey2","AUTH_TOKEN":"key_red"}]'

// Before all tests, sdk module is mocked to create a wrapper where a diifferent yaml file is assigned to each environment
// sdk factory mock to set a different yaml for each apikey and localhost mode
jest.mock('../sdk', () => ({
  getSplitFactory: jest.fn((settings) => {
    const { __dirname } = require('../utils/utils');
    const path = require('path');


    const mocksMap = {
      'localhost': '/parserConfigs/split.yml',
      'apikey1': '/split1.yml',
      'apikey2': '/split2.yml',
    };

    const configForMock = {
      ...settings,
      core: {
        ...settings.core,
        authorizationKey: 'localhost',
      },
      features: path.join(__dirname, mocksMap[settings.core.authorizationKey]),
      scheduler: {
        ...settings.scheduler,
        offlineRefreshRate: 0,
      },
    };

    let sdk = jest.requireActual('../sdk');
    const factory = sdk.getSplitFactory(configForMock);
    return factory;
  }),
}));