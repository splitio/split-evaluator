//
// SDK initialization and factory instanciation.
//
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const context = require('./listener/context');
const settings = require('./utils/parserConfigs')();

if (settings.impressionListener) {
  context.start();
}

let isClientReady = false;

// Our SDK factory instance.
const factory = SplitFactory(settings);
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
