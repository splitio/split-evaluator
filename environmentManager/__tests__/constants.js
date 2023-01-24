const core = {
  authorizationKey: 'API_KEY',
  labelIsEnabled: false,
  IPAddressesEnabled: false,
};

const scheduler = {
  featuresRefreshRate: 7,
  segmentsRefreshRate: 7,
  impressionsRefreshRate: 7,
  impressionsQueueSize: 7,
  eventsPushRate: 7,
  eventsQueueSize: 7,
  metricsRefreshRate: 7,
};

const urls = {
  sdk: 'https://sdk.global-split.io/api',
  events: 'https://events.global-split.io/api',
  auth: 'https://auth.global-split.io/api',
  streaming: 'https://streaming.global-split.io',
  telemetry: 'https://telemetry.global-split.io/api',
};

const startup = {
  requestTimeoutBeforeReady: 7,
  retriesOnFailureBeforeReady: 7,
  readyTimeout: 7,
};

const storage = {
  type: 'redis',
  prefix: 'SPLITIO',
};

const sync = {
  splitFilters: [{
    type: 'byName',
    values: ['split_name_1', 'split_name_2'],
  }],
  impressionsMode: 'NONE',
  enabled: false,
};

const integrations = [{
  type: 'GOOGLE_ANALYTICS_TO_SPLIT',
}];

module.exports = { core, scheduler, urls, startup, storage, sync, integrations };