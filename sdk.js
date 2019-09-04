//
// SDK initialization and factory instanciation.
//

const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const config = require('config');
const merge = require('lodash/merge');
const logger = require('./config/winston');
const logImpression = require('./listener/impressionListener');
const context = require('./listener/context');

// Support for API KEY override
const envSettings = config.get('sdk');
let settings = envSettings;

if (process.env.SPLITIO_API_KEY) {
  settings = merge({}, settings, {
    core: {
      authorizationKey: process.env.SPLITIO_API_KEY
    }
  });
} else {
  logger.error('No API Key was provided.');
  throw new Error('API Key cannot be empty or null.');
}

//SDK URL can be set by env for debug
if (process.env.SDK_URL) {
  settings = merge({}, settings, {
    urls: {
      sdk: process.env.SDK_URL
    }
  });
}

//EVENTS URL can be set by env for debug
if (process.env.EVENTS_URL) {
  settings = merge({}, settings, {
    urls: {
      events: process.env.EVENTS_URL
    }
  });
}

if (process.env.SPLITIO_SCHEDULER) {
  try {
    settings = merge({}, settings, {
      scheduler: JSON.parse(process.env.SPLITIO_SCHEDULER)
    });
  } catch(e) {
    logger.error('There was an error parsing the custom scheduler');
  }
}

logger.info(`APIKEY: ${process.env.SPLITIO_API_KEY}`);
logger.info(`SDK_URL: ${process.env.SDK_URL}`);
logger.info(`EVENTS_URL: ${process.env.EVENTS_URL}`);
if (process.env.SPLITIO_IMPRESSION_LISTENER) {
  settings = merge({}, settings, {
    impressionListener: {
      logImpression,
    },
  });
  context.start();
  logger.info(`IMPRESSION_LISTENER: ${process.env.SPLITIO_IMPRESSION_LISTENER}`);
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

client.on(client.Event.SDK_READY, () => {
  logger.info(`ON SDK_READY, IS CLIENT READY?: ${isClientReady}`);
  return isClientReady === true;
});

module.exports = {
  factory,
  client,
  manager,
  isReady
};
