const osFunction = require('os');
const { address } = require('../../utils/ip');

const { UNKNOWN, NA, CONSUMER_MODE } = require('@splitsoftware/splitio-commons/cjs/utils/constants');

function validateRuntime(settings) {
  const isIPAddressesEnabled = settings.core.IPAddressesEnabled === true;
  const isConsumerMode = settings.mode === CONSUMER_MODE;

  // If the values are not available, default to false (for standalone) or "unknown" (for consumer mode, to be used on Redis keys)
  let ip = address() || (isConsumerMode ? UNKNOWN : false);
  let hostname = osFunction.hostname() || (isConsumerMode ? UNKNOWN : false);

  if (!isIPAddressesEnabled) { // If IPAddresses setting is not enabled, set as false (for standalone) or "NA" (for consumer mode, to  be used on Redis keys)
    ip = hostname = isConsumerMode ? NA : false;
  }

  return {
    ip, hostname,
  };
}

module.exports = {
  validateRuntime,
};