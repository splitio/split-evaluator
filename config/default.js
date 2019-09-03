//
// NODEJS SDK - IN MEMORY STORAGE - STANDALONE MODE
//
const path = require('path');

module.exports = {
  sdk: {
    // In case someone uses localhost with the same file
    features: path.join(__dirname, 'split.yml'),
  },
  // Block the ExpressJS server till the SDK is ready.
  blockUntilReady: true,
  // Impression Listener Webhook
  impressionListenerEnabled: true,
  impressionsPerPost: 500,
  impressionsSendRate: 15000,
};
