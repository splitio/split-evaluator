const osFunction = require('os');
const { address } = require('../../utils/ip');

function validateRuntime(settings) {
  const isIPAddressesEnabled = settings.core.IPAddressesEnabled === true;

  // If the values are not available, default to false
  let ip = address() || false;
  let hostname = osFunction.hostname() || false;

  if (!isIPAddressesEnabled) {
    ip = hostname = false;
  }

  return {
    ip, hostname,
  };
}

module.exports = {
  validateRuntime,
};