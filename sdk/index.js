const { splitApiFactory } = require('@splitsoftware/splitio-commons/cjs/services/splitApi');
const { syncManagerOnlineFactory } = require('@splitsoftware/splitio-commons/cjs/sync/syncManagerOnline');
const { pushManagerFactory } = require('@splitsoftware/splitio-commons/cjs/sync/streaming/pushManager');
const { pollingManagerSSFactory } = require('@splitsoftware/splitio-commons/cjs/sync/polling/pollingManagerSS');
const { InMemoryStorageFactory } = require('@splitsoftware/splitio-commons/cjs/storages/inMemory/InMemoryStorage');
const { getRolloutPlan } = require('@splitsoftware/splitio-commons/cjs/storages/getRolloutPlan');
const { sdkManagerFactory } = require('@splitsoftware/splitio-commons/cjs/sdkManager');
const { sdkClientMethodFactory } = require('@splitsoftware/splitio-commons/cjs/sdkClient/sdkClientMethod');
const { impressionObserverSSFactory } = require('@splitsoftware/splitio-commons/cjs/trackers/impressionObserver/impressionObserverSS');
const { sdkFactory } = require('@splitsoftware/splitio-commons/cjs/sdkFactory');
const { isConsumerMode } = require('@splitsoftware/splitio-commons/cjs/utils/settingsValidation/mode');

const { settingsFactory } = require('./settings');
const { platform, SignalListener } = require('./platform');
const { bloomFilterFactory } = require('./platform/filter/bloomFilter');

const syncManagerOnlineSSFactory = syncManagerOnlineFactory(pollingManagerSSFactory, pushManagerFactory);


/**
 *
 * @param {import("@splitsoftware/splitio-commons/types/types").ISettings} settings
 */
function getModules(settings) {

  const modules = {
    settings,

    platform,

    storageFactory: InMemoryStorageFactory,

    splitApiFactory,

    syncManagerFactory: syncManagerOnlineSSFactory,

    sdkManagerFactory,

    sdkClientMethodFactory,

    SignalListener,

    impressionsObserverFactory: impressionObserverSSFactory,

    filterAdapterFactory: bloomFilterFactory,

    extraProps: (params) => {
      if (!isConsumerMode(params.settings.mode)) {
        return {
          getRolloutPlan(options) {
            return getRolloutPlan(params.settings.log, params.storage, options);
          },
        };
      }
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
  const modules = getModules(settings);
  if (__updateModules) __updateModules(modules);
  return sdkFactory(modules);
}

module.exports = {
  SplitFactory,
};