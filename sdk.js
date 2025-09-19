//
// SDK initialization and factory instanciation.
//
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const { HttpsProxyAgent } = require('https-proxy-agent');
const utils = require('./utils/utils');

const getSplitFactory = (settings) => {
  const logLevel = settings.logLevel;
  delete settings.logLevel;

  // Create proxy agent for corporate proxy - SDK doesn't honor HTTPS_PROXY env var
  const proxyUrl = process.env.HTTPS_PROXY || 'http://webproxy.df1.cust.services:80';
  const proxyAgent = new HttpsProxyAgent(proxyUrl);

  // Enhance settings with explicit proxy configuration
  const enhancedSettings = {
    ...settings,
    sync: {
      ...settings.sync,
      requestOptions: {
        agent: proxyAgent
      }
    }
  };

  console.log(`Split.io SDK configured to use proxy: ${proxyUrl}`);

  let impressionsMode;
  let telemetry;
  const factory = SplitFactory(enhancedSettings, (modules) => {
    // Do not try this at home.
    modules.settings.sdkVersion = modules.settings.version;
    modules.settings.version = `evaluator-${utils.getVersion()}`;
    impressionsMode = modules.settings.sync.impressionsMode;
    const originalStorageFactory = modules.storageFactory;
    modules.storageFactory = (config) => {
      const storage = originalStorageFactory(config);
      telemetry = storage.telemetry;
      return storage;
    };
  });

  if (logLevel) {
    console.log('Setting log level with', logLevel);
    factory.Logger.setLogLevel(logLevel);
  }

  return { factory, telemetry, impressionsMode };
};

module.exports = {
  getSplitFactory,
};
