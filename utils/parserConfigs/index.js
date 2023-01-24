const path = require('path');
const { mergeWithPriority } = require('../utils');
const { parseNumber, validUrl, validLogLevel, validGlobalConfig } = require('./validators');

const getConfigs = () => {
  let configs = {
    features: path.join(__dirname, 'split.yml'),
    core: {},
  };

  if (process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG) {
    console.info('Setting global config');
    const globalConfig = validGlobalConfig('SPLIT_EVALUATOR_GLOBAL_CONFIG');

    // Core configurations are being done in environments param
    delete globalConfig.core;
    // Always in memory (default)
    delete globalConfig.storage;
    // Always standalone (default)
    delete globalConfig.mode;
    // integrations not allowed
    delete globalConfig.integrations;
    // synchronization always enabled (default)
    if (globalConfig.sync) delete globalConfig.sync.enabled;

    configs = mergeWithPriority(configs, globalConfig);
  }

  // LOG LEVEL
  const logLevel = validLogLevel('SPLIT_EVALUATOR_LOG_LEVEL');
  if (logLevel) {
    configs.logLevel = logLevel;
  }

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
  const auth = process.env.SPLIT_EVALUATOR_AUTH_SERVICE_URL;
  if (auth) urls.auth = auth;
  const telemetry = process.env.SPLIT_EVALUATOR_TELEMETRY_URL;
  if (telemetry) urls.telemetry = telemetry;

  // IMPRESSION LISTENER
  if (process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT && validUrl('SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT')) {
    console.log('Setting impression listener.');
    const impressionListener = require('../../listener/');
    configs.impressionListener = impressionListener;
  }

  // IP ADDRESS ENABLED
  if (process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED && process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED.toLowerCase() === 'false') {
    configs.core.IPAddressesEnabled = false;
  }

  if (Object.keys(scheduler).length > 0) {
    console.log('Setting custom SDK scheduler timers.');
    // merge global and environment config priorizing environment variables
    configs.scheduler = mergeWithPriority(scheduler, configs.scheduler);
  }

  if (Object.keys(urls).length > 0) {
    console.log('Setting custom urls.');
    // merge global and environment config priorizing environment variables
    configs.urls = mergeWithPriority(urls, configs.urls);
  }

  return configs;
};

module.exports = getConfigs;