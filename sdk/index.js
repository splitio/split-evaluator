const { serverSideModules } = require('@splitsoftware/splitio-commons/cjs/presets/serverSide');
const { getRolloutPlan } = require('@splitsoftware/splitio-commons/cjs/storages/getRolloutPlan');

const { sdkFactory } = require('@splitsoftware/splitio-commons/cjs/sdkFactory');
const { isConsumerMode } = require('@splitsoftware/splitio-commons/cjs/utils/settingsValidation/mode')
const { settingsFactory } = require('./settings');
const { platform, SignalListener } = require('./platform');
const { bloomFilterFactory } = require('./platform/filter/bloomFilter');

/**
 *
 * @param {import("@splitsoftware/splitio-commons/types/types").ISettings} settings
 */
function getModules(settings) {

  const modules = {

    ...serverSideModules,

    settings,

    platform,

    SignalListener,

    filterAdapterFactory: bloomFilterFactory,

    extraProps: (params) => {
      return {
        getRolloutPlan(options) {
          return getRolloutPlan(params.settings.log, params.storage, options);
        },
      };
    },
  };

  return modules;
}

/**
 * SplitFactory for server-side.
 *
 * @param {SplitIO.INodeSettings | SplitIO.INodeAsyncSettings} config configuration object used to instantiate the SDK
 * @param {Function=} __updateModules optional function that lets redefine internal SDK modules. Use with
 * caution since, unlike `config`, this param is not validated neither considered part of the public API.
 * @throws Will throw an error if the provided config is invalid.
 */
function SplitFactory(config, __updateModules) {
  const settings = settingsFactory(config);

  if (isConsumerMode(settings.mode)) {
    if (settings.log && typeof settings.log.warn === 'function') {
      settings.log.warn("You are using 'mode: consumer' (Redis) which is not supported by this version of the Split Evaluator. Falling back to 'standalone' mode (In-Memory). Please update your configuration.");
    }
    settings.mode = 'standalone';
  }

  const modules = getModules(settings);
  if (__updateModules) __updateModules(modules);
  return sdkFactory(modules);
}

module.exports = {
  SplitFactory,
};