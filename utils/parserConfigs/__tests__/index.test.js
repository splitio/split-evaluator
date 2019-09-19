const settings = require('../index');

describe('getConfigs', () => {
  // Testing authorization
  test('apikey', done => {
    // Test null
    expect(() => settings().toThrow());

    // Test empty
    process.env.SPLIT_EVALUATOR_API_KEY = '';
    expect(() => settings().toThrow());  

    // Test trim
    process.env.SPLIT_EVALUATOR_API_KEY = '   ';
    expect(() => settings().toThrow());  

    // Test ok
    process.env.SPLIT_EVALUATOR_API_KEY = 'something';
    expect(() => settings().not.toThrow());

    const options = settings();
    expect(options).toHaveProperty('core', { authorizationKey: 'something'});
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

    const options = settings();
    expect(options).toHaveProperty('core', { authorizationKey: 'something'});
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

    const options = settings();
    expect(options).toHaveProperty('core', { authorizationKey: 'something'});
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
