//
// SDK initialization and factory instanciation.
//
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const utils = require('./utils/utils');

const getSplitFactory = (settings) => {
  const logLevel = settings.logLevel;
  delete settings.logLevel;

  const factory = SplitFactory(settings, ({settings}) => {
    // Do not try this at home.
    settings.sdkVersion = settings.version;
    settings.version = `evaluator-${utils.getVersion()}`;
  });
  
  if (logLevel) {
    console.log('Setting log level with', logLevel);
    factory.Logger.setLogLevel(logLevel);
  }
  
  return factory;
};

module.exports = {
  getSplitFactory,
};
