'use strict';

const packageJson = require('./package.json');

/**
 * Given a pair of values, make the processing to create the SplitKey value.
 */
const parseKey = (matchingKey, bucketingKey) => {
  if (!bucketingKey) {
    return matchingKey;
  }

  return {
    matchingKey,
    bucketingKey
  };
};
/**
 * Get the version.
 */
const getVersion = () => packageJson && packageJson.version;

// uptime timer initial time.
let serverUpSince = null;
/**
 * 
 * @param {boolean} [init] - Wether we need to initialize the timer. If it's falsey, return the current uptime.
 */
const uptime = init => {
  if (init) {
    serverUpSince = Date.now()
  } else {
    return toHHMMSS(Date.now() - serverUpSince);
  }
}

function toHHMMSS (ms) {
  let sec_num = ms / 1000; // Transform to seconds for easier numbers, as we expect millis.
  // And after each count, we remove the counted ammount from sec_num;
  const days = Math.floor(sec_num / 86400); sec_num-= days * 86400;
  const hours = Math.floor(sec_num / 3600); sec_num-= hours * 3600;
  const minutes = Math.floor(sec_num / 60); sec_num-= minutes * 60;

  return `${days}d ${hours}h ${minutes}m ${Math.round(sec_num)}s`;
}

module.exports = {
  parseKey,
  getVersion,
  uptime
};