const packageJson = require('../package.json');


/**
 * Get the version.
 */
const getVersion = () => packageJson && packageJson.version;

module.exports = {
  getVersion,
};