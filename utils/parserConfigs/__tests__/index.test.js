const settings = require('../index');

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
});
