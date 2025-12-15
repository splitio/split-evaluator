const { isConsumerMode } = require('@splitsoftware/splitio-commons/cjs/utils/settingsValidation/mode');
const { getSplitFactory } = require('../../sdk');

describe('SDK Wiring & Glue Code Integration', () => {
  const baseConfig = {
    core: {
      authorizationKey: 'localhost',
    },
    features: {
      'test_feature': 'on',
    },
  };

  test('Should initialize correctly in OPTIMIZED mode - bloomFilter', async () => {
    const optimizedConfig = {
      ...baseConfig,
      sync: {
        impressionsMode: 'OPTIMIZED',
      },
    };

    const { factory } = getSplitFactory(optimizedConfig);
    const client = factory.client();

    await client.ready();
    
    const treatment = client.getTreatment('test', 'my-experiment');
    expect(treatment).toBe('on');

    await expect(client.destroy()).resolves.toBeUndefined();
  });

  test('SDK_READY event must be emitted and resolved', (done) => {
    const { factory } = getSplitFactory(baseConfig);
    const client = factory.client();

    let readyCalled = false;

    client.on(client.Event.SDK_READY, () => {
      readyCalled = true;
      client.destroy().then(async () => {
        expect(readyCalled).toBe(true);
        await expect(client.destroy()).resolves.toBeUndefined();

        done();
      });
    });

    setTimeout(() => {
      if (!readyCalled) {
        client.destroy();
        done(new Error('SDK_READY event was not emitted within timeout'));
      }
    }, 2000);
  });

  test('ExtraProps adds getRolloutPlan to Manager', async () => {
    const { factory } = getSplitFactory(baseConfig);

    expect(typeof factory.getRolloutPlan).toBe('function');

    const plan = factory.getRolloutPlan({ feature: 'my-experiment' });
    expect(plan).toBeDefined();
    expect(plan.splitChanges).toBeDefined();

    await expect(factory.destroy()).resolves.toBeUndefined();

  });

  test('Destroy must resolve and clean up resources', async () => {
    const { factory } = getSplitFactory(baseConfig);
    const client = factory.client();

    await client.ready();

    await expect(client.destroy()).resolves.toBeUndefined();
  });

  test('Must force STANDALONE mode if it receives CONSUMER mode', async () => {
    const consumerConfig = {
      ...baseConfig,
      mode: 'consumer',
      storage: {
        type: 'REDIS',
        prefix: 'test',
      },
    };
    
    const { factory } = getSplitFactory(consumerConfig);
    
    expect(isConsumerMode(factory.settings)).toBe(false);

    const client = factory.client();
    expect(client).toBeDefined();

    await client.ready();

    const treatment = client.getTreatment('test', 'my-experiment');
    expect(treatment).toBe('on');

    await expect(client.destroy()).resolves.toBeUndefined();
  });
});