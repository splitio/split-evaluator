//
// SDK initialization and factory instanciation.
//
const { SplitFactory } = require('./sdk/index.js');
const utils = require('./utils/utils');

const getSplitFactory = (settings, logLabel, moduleOverrider) => {
  // Backwards compatibility: allow passing moduleOverrider as the 2nd arg.
  if (typeof logLabel === 'function') {
    moduleOverrider = logLabel;
    logLabel = undefined;
  }
  settings = { ...settings };
  const logLevel = settings.logLevel;
  delete settings.logLevel;

  let impressionsMode;
  let telemetry;
  const factory = SplitFactory(settings, (modules) => {
    // Do not try this at home.
    modules.settings.sdkVersion = modules.settings.version;
    modules.settings.version = `evaluator-${utils.getVersion()}`;
    // Prefix every SDK log line with the label so lines from concurrent
    // environments can be told apart.
    if (logLabel && modules.settings.log && modules.settings.log.options) {
      modules.settings.log.options.prefix = `splitio [${logLabel}]`;
    }
    impressionsMode = modules.settings.sync.impressionsMode;
    const originalStorageFactory = modules.storageFactory;
    modules.storageFactory = (config) => {
      const storage = originalStorageFactory(config);
      telemetry = storage.telemetry;
      return storage;
    };
    if (moduleOverrider) moduleOverrider(modules);

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
