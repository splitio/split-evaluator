const packageJson = require('../package.json');

let serverUpSince = null;

/**
 * getVersion returns current version
 */
const getVersion = () => packageJson && packageJson.version;

/**
 * toHHMMSS parses time
 * @param {Number} ms
 */
const toHHMMSS = (ms) => {
  let secNum = ms / 1000; // Transform to seconds for easier numbers, as we expect millis.
  // And after each count, we remove the counted ammount from secNum;
  const days = Math.floor(secNum / 86400); secNum -= days * 86400;
  const hours = Math.floor(secNum / 3600); secNum -= hours * 3600;
  const minutes = Math.floor(secNum / 60); secNum -= minutes * 60;

  return `${days}d ${hours}h ${minutes}m ${Math.round(secNum)}s`;
};

/**
 * uptime Wether we need to initialize the timer. If it's falsey, return the current uptime.
 * @param {boolean} init
 */
const uptime = init => {
  if (init) {
    serverUpSince = Date.now();
  } else {
    return toHHMMSS(Date.now() - serverUpSince);
  }
};

/**
 * parseValidators  Grabs each validator and merge the message to be displayed.
 * @param {Array} validators
 */
const parseValidators = (validators) => {
  const errors = [];
  validators.forEach(validator => {
    if (validator && !validator.valid) errors.push(validator.error);
  });
  return errors;
};

/**
 * parseValidators  Replace all characters with '#' leaving last 4
 * @param {Array} validators
 */
const obfuscate = (value) => {
  return value.replace(/.(?=.{4,}$)/g, '#');
};


module.exports = {
  getVersion,
  uptime,
  parseValidators,
  __dirname,
  obfuscate,
};
