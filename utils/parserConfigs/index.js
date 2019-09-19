const path = require('path');
const { nullOrEmpty, parseNumber, validUrl } = require('./validators');

const getConfigs = () => {
  const configs = {
    features: path.join(__dirname, 'split.yml'),
  };

  // DEBUG
  if (process.env.SPLIT_EVALUATOR_LOG_DEBUG && (process.env.SPLIT_EVALUATOR_LOG_DEBUG.toLowerCase() === 'true')) {
    console.log('Setting debug level true');
    configs.debug = true;
  }

  // CORE OPTIONS
  configs.core = {
    authorizationKey: nullOrEmpty('SPLIT_EVALUATOR_API_KEY'),
  };

  // SCHEDULER OPTIONS
  const scheduler = {};

  const featuresRefreshRate = parseNumber('SPLIT_EVALUATOR_SPLITS_REFRESH_RATE');
  if (featuresRefreshRate) scheduler.featuresRefreshRate = featuresRefreshRate;

  const segmentsRefreshRate = parseNumber('SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE');
  if (segmentsRefreshRate) scheduler.segmentsRefreshRate = segmentsRefreshRate;

  const metricsRefreshRate = parseNumber('SPLIT_EVALUATOR_METRICS_POST_RATE');
  if (metricsRefreshRate) scheduler.metricsRefreshRate = metricsRefreshRate;

  const impressionsRefreshRate = parseNumber('SPLIT_EVALUATOR_IMPRESSIONS_POST_RATE');
  if (impressionsRefreshRate) scheduler.impressionsRefreshRate = impressionsRefreshRate;

  const eventsPushRate = parseNumber('SPLIT_EVALUATOR_EVENTS_POST_RATE');
  if (eventsPushRate) scheduler.eventsPushRate = eventsPushRate;

  const eventsQueueSize = parseNumber('SPLIT_EVALUATOR_EVENTS_QUEUE_SIZE');
  if (eventsQueueSize) scheduler.eventsQueueSize = eventsQueueSize;

  // URLS
  const urls = {};
  const events = process.env.SPLIT_EVALUATOR_EVENTS_URL;
  if (events) urls.events = events;
  const sdk = process.env.SPLIT_EVALUATOR_SDK_URL;
  if (sdk) urls.sdk = sdk;

  // IMPRESSION LISTENER
  if (process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT && validUrl('SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT')) {
    console.log('Setting impression listener.');
    const logImpression = require('../../listener/');
    configs.impressionListener = {
      logImpression,
    };
  }

  if (Object.keys(scheduler).length > 0) {
    console.log('Setting custom SDK scheduler timers.');
    configs.scheduler = scheduler;
  }

  if (Object.keys(urls).length > 0) {
    console.log('Setting custom urls.');
    configs.urls = urls;
  }
  
  return configs;
};

module.exports = getConfigs;