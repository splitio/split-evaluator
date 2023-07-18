//
// SDK initialization and factory instanciation.
//
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const utils = require('./utils/utils');

const getSplitFactory = (settings) => {
  const logLevel = settings.logLevel;
  delete settings.logLevel;

  let impressionsMode;
  let telemetry;
  const factory = SplitFactory(settings, (modules) => {
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
