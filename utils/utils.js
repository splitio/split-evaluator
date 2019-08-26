const packageJson = require('../package.json');

let serverUpSince = null;

/**
 * Get the version.
 */
const getVersion = () => packageJson && packageJson.version;// uptime timer initial time.
/**
 * 
 * @param {boolean} [init] - Wether we need to initialize the timer. If it's falsey, return the current uptime.
 */
const uptime = init => {
  if (init) {
    serverUpSince = Date.now();
  } else {
    return toHHMMSS(Date.now() - serverUpSince);
  }
};

function toHHMMSS(ms) {
  let secNum = ms / 1000; // Transform to seconds for easier numbers, as we expect millis.
  // And after each count, we remove the counted ammount from secNum;
  const days = Math.floor(secNum / 86400); secNum -= days * 86400;
  const hours = Math.floor(secNum / 3600); secNum -= hours * 3600;
  const minutes = Math.floor(secNum / 60); secNum -= minutes * 60;

  return `${days}d ${hours}h ${minutes}m ${Math.round(secNum)}s`;
}

module.exports = {
  getVersion,
  uptime,
};