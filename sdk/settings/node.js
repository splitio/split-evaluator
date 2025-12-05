const { settingsValidation } = require('@splitsoftware/splitio-commons/cjs/utils/settingsValidation');
const { validateLogger } = require('@splitsoftware/splitio-commons/cjs/utils/settingsValidation/logger/builtinLogger');

const { defaults } = require('./defaults/node');
const { validateStorage } = require('./storage/node');
const { validateRuntime } = require('./runtime/node');

const params = {
  defaults,
  runtime: validateRuntime,
  storage: validateStorage,
  logger: validateLogger,
};

function settingsFactory(config) {
  const settings = settingsValidation(config, params);

  // if provided, keeps reference to the `requestOptions` object
  if (settings.sync.requestOptions) settings.sync.requestOptions = config.sync.requestOptions;
  return settings;
}

module.exports = {
  settingsFactory,
};