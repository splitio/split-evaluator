const settings = require('../index');
const constants = require('../../../environmentManager/__tests__/constants');

describe('getConfigs', () => {
  test('apikey', done => {
    // Test null
    expect(() => settings().toThrow());

    // Test empty
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS='[{"API_KEY":"","AUTH_TOKEN":"test"}]';
    expect(() => settings().toThrow());

    // Test trim
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS='[{"API_KEY":"   ","AUTH_TOKEN":"test"}]';
    expect(() => settings().toThrow());

    // Test ok
    process.env.SPLIT_EVALUATOR_ENVIRONMENTS='[{"API_KEY":"something","AUTH_TOKEN":"test"}]';
    expect(() => settings().not.toThrow());

    const options = settings();
    expect(options).not.toHaveProperty('impressionListener');
    expect(options).not.toHaveProperty('scheduler');
    expect(options).not.toHaveProperty('urls');
    done();
  });

  test('log level', done => {
    // Test empty
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = '';
    expect(() => settings().toThrow());

    // Test wrong level
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = 'WRONG';
    expect(() => settings().toThrow());

    delete process.env.SPLIT_EVALUATOR_LOG_LEVEL;
    process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = '{ "DEBUG": true }';
    const global = settings();
    expect(global).toHaveProperty('DEBUG', true);

    // Test INFO
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = 'INFO';
    expect(() => settings().not.toThrow());
    const info = settings();
    expect(info).toHaveProperty('logLevel', 'INFO');

    // Test WARN
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = 'WARN';
    expect(() => settings().not.toThrow());
    const warn = settings();
    expect(warn).toHaveProperty('logLevel', 'WARN');

    // Test ERROR
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = 'ERROR';
    expect(() => settings().not.toThrow());
    const error = settings();
    expect(error).toHaveProperty('logLevel', 'ERROR');

    // Test NONE
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = 'NONE';
    expect(() => settings().not.toThrow());
    const none = settings();
    expect(none).toHaveProperty('logLevel', 'NONE');

    // Test DEBUG
    process.env.SPLIT_EVALUATOR_LOG_LEVEL = 'DEBUG';
    expect(() => settings().not.toThrow());
    const debug = settings();
    expect(debug).toHaveProperty('logLevel', 'DEBUG');

    done();
  });

  test('ipAddressesEnabled', done => {
    // Test ok
    process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = 'false';
    expect(() => settings().not.toThrow());

    const options = settings();
    expect(options).toHaveProperty('core', { IPAddressesEnabled: false });
    expect(options).not.toHaveProperty('impressionListener');
    expect(options).not.toHaveProperty('scheduler');
    expect(options).not.toHaveProperty('urls');
    done();
  });

  test('listener', done => {
    // Test empty
    process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = '';
    expect(() => settings().toThrow());

    // Test trim
    process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = '       ';
    expect(() => settings().toThrow());

    // Test ok
    process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'something';
    expect(() => settings().toThrow());

    process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = '1234567';
    expect(() => settings().toThrow());

    process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'http://localhost:1111/impressions';

    process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = null;

    const options = settings();
    expect(options).toHaveProperty('impressionListener');
    expect(options).not.toHaveProperty('scheduler');
    expect(options).not.toHaveProperty('urls');
    done();
  });

  test('scheduler', done => {
    // Test empty values
    process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE = '';
    expect(() => settings().toThrow());

    // Test trim
    process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE = '     ';
    expect(() => settings().toThrow());

    // Test NaN
    process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_METRICS_POST_RATE = 'asdf';
    expect(() => settings().toThrow());

    // Test empty
    process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_METRICS_POST_RATE = '1';
    process.env.SPLIT_EVALUATOR_IMPRESSIONS_POST_RATE = '    ';
    expect(() => settings().toThrow());

    // Test ok values
    process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE = '1';
    process.env.SPLIT_EVALUATOR_METRICS_POST_RATE = '1';
    process.env.SPLIT_EVALUATOR_IMPRESSIONS_POST_RATE = '1';
    process.env.SPLIT_EVALUATOR_EVENTS_POST_RATE = '1';
    process.env.SPLIT_EVALUATOR_EVENTS_QUEUE_SIZE = '100';
    expect(() => settings().toThrow());

    process.env.SPLIT_EVALUATOR_IMPRESSION_LISTENER_ENDPOINT = 'https://127.0.0.1';
    expect(() => settings().not.toThrow());

    process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = null;

    const options = settings();
    expect(options).toHaveProperty('impressionListener');
    expect(options).toHaveProperty('scheduler');
    expect(options).toHaveProperty('scheduler.featuresRefreshRate', 1);
    expect(options).toHaveProperty('scheduler.segmentsRefreshRate', 1);
    expect(options).toHaveProperty('scheduler.metricsRefreshRate', 1);
    expect(options).toHaveProperty('scheduler.impressionsRefreshRate', 1);
    expect(options).toHaveProperty('scheduler.eventsPushRate', 1);
    expect(options).toHaveProperty('scheduler.eventsQueueSize', 100);
    done();
  });

  test('globalConfig', done => {
    delete process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE;
    delete process.env.SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE;
    delete process.env.SPLIT_EVALUATOR_METRICS_POST_RATE;
    delete process.env.SPLIT_EVALUATOR_IMPRESSIONS_POST_RATE;
    delete process.env.SPLIT_EVALUATOR_EVENTS_POST_RATE;
    delete process.env.SPLIT_EVALUATOR_EVENTS_QUEUE_SIZE;

    // null or empty
    process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = null;
    expect(() => settings()).toThrow();

    // // is string
    process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = {'debug': true};
    expect(() => settings()).toThrow();

    // Test core property cleanning
    process.env.SPLIT_EVALUATOR_GLOBAL_CONFIG = JSON.stringify({
      core: constants.core,
      scheduler: constants.scheduler,
      urls: constants.urls,
      storage: constants.storage,
      startup: constants.startup,
      sync: constants.sync,
      mode: 'consumer',
      debug: true,
      streamingEnabled: false,
      integrations: constants.integrations,
    });
    let config = settings();

    // core should be deleted to use environment configurations
    expect(config.core).toEqual({});
    expect(config.scheduler).toEqual(constants.scheduler);
    expect(config.urls).toEqual(constants.urls);
    // storage should be deleted to use default in memory
    expect(config.storage).toEqual(undefined);
    expect(config.startup).toEqual(constants.startup);
    // should avoid sync.enabled property to use default false
    constants.sync.enabled = undefined;
    expect(config.sync).toEqual(constants.sync);
    // should avoid mode property to use default standalone
    expect(config.mode).toEqual(undefined);
    expect(config.debug).toBe(true);
    expect(config.streamingEnabled).toBe(false);
    // integrations config should be avoided
    expect(config.integrations).toEqual(undefined);

    // scheduler evaluator configs should be priorized over global configs
    process.env.SPLIT_EVALUATOR_SPLITS_REFRESH_RATE = 2;
    process.env.SPLIT_EVALUATOR_SEGMENTS_REFRESH_RATE = 2;
    process.env.SPLIT_EVALUATOR_METRICS_POST_RATE = 2;
    process.env.SPLIT_EVALUATOR_IMPRESSIONS_POST_RATE = 2;
    process.env.SPLIT_EVALUATOR_EVENTS_POST_RATE = 2;
    process.env.SPLIT_EVALUATOR_EVENTS_QUEUE_SIZE = 2;

    // url evaluator configs should be priorized over global configs
    process.env.SPLIT_EVALUATOR_SDK_URL = 'https://sdk.env-split.io/api';
    process.env.SPLIT_EVALUATOR_EVENTS_URL = 'https://events.env-split.io/api';
    process.env.SPLIT_EVALUATOR_AUTH_SERVICE_URL = 'https://auth.env-split.io/api';
    process.env.SPLIT_EVALUATOR_TELEMETRY_URL = 'https://telemetry.env-split.io/api';

    // IP Addresses enabled evaluator configs should be priorized over global configs
    process.env.SPLIT_EVALUATOR_IP_ADDRESSES_ENABLED = 'false';

    config = settings();
    expect(config.scheduler).toEqual({
      eventsPushRate: 2,
      eventsQueueSize: 2,
      featuresRefreshRate: 2,
      impressionsQueueSize: 7,
      impressionsRefreshRate: 2,
      segmentsRefreshRate: 2,
      metricsRefreshRate: 2,
    });
    expect(config.core.IPAddressesEnabled).toBe(false);
    expect(config.urls).toEqual({
      'sdk': process.env.SPLIT_EVALUATOR_SDK_URL,
      'events': process.env.SPLIT_EVALUATOR_EVENTS_URL,
      'auth': process.env.SPLIT_EVALUATOR_AUTH_SERVICE_URL,
      'streaming': config.urls.streaming,
      'telemetry': process.env.SPLIT_EVALUATOR_TELEMETRY_URL,
    });

    done();
  });

});
