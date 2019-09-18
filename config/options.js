module.exports = {
  core: {
    authorizationKey: 'YOUR_API_KEY/',                                    // SPLIT_EVALUATOR_API_KEY
    labelsEnabled: true,                                                  // SHOULD WE ADD?
  },
  scheduler: {
    featuresRefreshRate:    5,                                            // SPLIT_EVALUATOR_SPLITS_REFRESH_RATE
    segmentsRefreshRate:    60,                                           // SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE
    metricsRefreshRate:     60,                                           // SPLIT_EVALUATOR_METRICS_POST_RATE
    impressionsRefreshRate: 60,                                           // SPLIT_EVALUATOR_IMPRESSIONS_POST_RATE
    eventsPushRate:         60,                                           // SPLIT_EVALUATOR_EVENTS_POST_RATE
    eventsQueueSize:       500,                                           // SPLIT_EVALUATOR_EVENTS_QUEUE_SIZE
  },
  storage: {
    type: 'MEMORY//REDIS',                                                // SPLIT_EVALUATOR_STORAGE_MODE
    options: {                                                            // ONLY FOR REDIS MODE
      url: 'redis://<your-redis-server>:<your-redis-server-port>/0',      // SPLIT_EVALUATOR_REDIS_HOST && SPLIT_EVALUATOR_REDIS_PORT
      // SPLIT_SYNC_REDIS_DB -> NOT FOUND IN SDK -> SHOULD WE ADD?
      // SPLIT_SYNC_REDIS_PASS -> NOT FOUND IN SDK -> SHOULD WE ADD?
    },
    prefix: 'nodejs',                                                     // SPLIT_EVALUATOR_REDIS_PREFIX
  },
  startup: {
    requestTimeoutBeforeReady: 1.5,                                       // SHOULD WE ADD?
    retriesOnFailureBeforeReady: 3,                                       // SHOULD WE ADD?
    readyTimeout: 5,                                                      // SHOULD WE ADD?
  },
  debug: true,                                                            // SPLIT_EVALUATOR_LOG_DEBUG
  urls: {
    events: '',                                                           // SPLIT_EVALUATOR_EVENTS_URL
    sdk: '',                                                              // SPLIT_EVALUATOR_SDK_URL
  },
  impressionListener: {
    logImpression: function () { return null; },                          // SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT
  },
};