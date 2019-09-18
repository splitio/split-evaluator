const path = require('path');
const logImpression = require('../../listener/impressionListener');

const throwError = (msg) => {
  console.log(msg);
  throw new Error(msg);
};

const isUndefined = (name) => {
  const input = process.env[name];
  // eslint-disable-next-line eqeqeq
  if (input == undefined) throwError(`you passed a null or undefined ${name}, ${name} must be a non-empty string.`);
  return input;
};

const isEmpty = (name) => {
  const trimmed = process.env[name].trim();
  if (trimmed.length === 0) throwError(`you passed an empty ${name}, ${name} must be a non-empty string.`);
  return trimmed;
};

const nullOrEmpty = (name) => {
  isUndefined(name);
  return isEmpty(name);
};

const parseNumber = (name) => {
  const input = process.env[name];
  // eslint-disable-next-line eqeqeq
  if (input == undefined) return null;

  const trimmed = input.trim();
  if (trimmed.length === 0) throwError(`you passed an empty ${name}, ${name} must be a non-empty string.`);
  const inputNumber = Number(trimmed);
  if (isNaN(inputNumber)) throwError(`you passed an invalid ${name}, ${name} must be a valid convertion number.`);
  return inputNumber;
};

const getSDKConfigs = () => {
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
  if (process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT && isEmpty('SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT') !== null) {
    console.log('Setting impression listener.');
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

module.exports = getSDKConfigs;