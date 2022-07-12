//
// SDK initialization and factory instanciation.
//
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const settings = require('./utils/parserConfigs')();
const utils = require('./utils/utils');

const logLevel = settings.logLevel;
delete settings.logLevel;

let isClientReady = false;
// Our SDK factory instance.
const factory = SplitFactory(settings, ({settings}) => {
  // Do not try this at home.
  settings.sdkVersion = settings.version;
  settings.version = `evaluator-${utils.getVersion()}`;
});

if (logLevel) {
  console.log('Setting log level with', logLevel);
  factory.Logger.setLogLevel(logLevel);
}

// Our client.
const client = factory.client();
// Our manager.
const manager = factory.manager();
// Returns true if the client is ready.
const isReady = () => isClientReady;

client.on(client.Event.SDK_READY, () => isClientReady = true);

module.exports = {
  factory,
  client,
  manager,
  isReady,
};
