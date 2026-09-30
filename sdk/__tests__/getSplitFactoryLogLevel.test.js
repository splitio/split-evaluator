// Regression coverage for FME-19676:
// getSplitFactory must not mutate the caller's settings object, so that
// environmentManager can loop with a shared settings reference and still
// have logLevel applied for every factory (not just the first).

jest.mock('../../sdk/index.js', () => {
  const setLogLevel = jest.fn();
  return {
    __setLogLevel: setLogLevel,
    SplitFactory: jest.fn((settings, moduleOverrider) => {
      const modules = {
        settings: {
          version: 'test',
          sync: { impressionsMode: 'OPTIMIZED' },
        },
        storageFactory: () => ({ telemetry: {} }),
      };
      if (moduleOverrider) moduleOverrider(modules);
      return { Logger: { setLogLevel } };
    }),
  };
});

describe('getSplitFactory - shared settings safety (FME-19676)', () => {
  let getSplitFactory;
  let setLogLevel;

  beforeEach(() => {
    jest.resetModules();
    setLogLevel = require('../../sdk/index.js').__setLogLevel;
    setLogLevel.mockClear();
    getSplitFactory = jest.requireActual('../../sdk').getSplitFactory;
  });

  test('does not mutate the caller settings object', () => {
    const settings = {
      core: { authorizationKey: 'apiKey1' },
      logLevel: 'INFO',
    };

    getSplitFactory(settings);

    expect(settings.logLevel).toBe('INFO');
    expect(settings).toHaveProperty('logLevel');
  });

  test('applies logLevel for every factory when called repeatedly with the same shared settings', () => {
    const settings = {
      core: { authorizationKey: 'apiKey1' },
      logLevel: 'INFO',
    };

    getSplitFactory(settings);
    settings.core.authorizationKey = 'apiKey2';
    getSplitFactory(settings);

    expect(setLogLevel).toHaveBeenCalledTimes(2);
    expect(setLogLevel).toHaveBeenNthCalledWith(1, 'INFO');
    expect(setLogLevel).toHaveBeenNthCalledWith(2, 'INFO');
  });

  test('does not call setLogLevel when logLevel is absent', () => {
    const settings = { core: { authorizationKey: 'apiKey1' } };

    getSplitFactory(settings);

    expect(setLogLevel).not.toHaveBeenCalled();
  });
});
