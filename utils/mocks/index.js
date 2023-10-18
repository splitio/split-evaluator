const apiKeyMocksMap = {
  'localhost': {
    splitUrl: '/parserConfigs/split.yml',
    splitNames: ['my-experiment','other-experiment-3','other-experiment','other-experiment-2'],
    segments: [],
    lastSynchronization: {
      sp: 1674855033145,
      to: 1674855033805,
      te: 1674855034008,
      im: 1674855034868,
    },
    timeUntilReady: 605,
    httpErrors: {},
  },
  'apikey1': {
    splitUrl: '/split1.yml',
    splitNames: ['testing_split_blue','testing_split_color','testing_split_only_wl','testing_split_with_wl','testing_split_with_config'],
    segments: [],
    lastSynchronization: {
      sp: 1674857486785,
      to: 1674857487438,
      te: 1674857487594,
    },
    timeUntilReady: 1000,
    httpErrors: {},
  },
  'apikey2': {
    splitUrl: '/split2.yml',
    splitNames: ['testing_split_red','testing_split_color','testing_split_only_wl','testing_split_with_wl','testing_split_with_config'],
    segments: [],
    lastSynchronization: {
      sp: 1674857489875,
      to: 1674857489888,
      te: 1674857488686,
    },
    timeUntilReady: 860,
    httpErrors: {},
  },
};

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
  impressionsMode: 'NONE',
  enabled: false,
};

const integrations = [{
  type: 'GOOGLE_ANALYTICS_TO_SPLIT',
}];

module.exports = { core, scheduler, urls, startup, storage, sync, integrations, apiKeyMocksMap };