const impressionManager = require('./manager').getInstance();

/**
 * logImpression  impresion listener handler
 * @param {Object} impressionData
 */
const logImpression = (impressionData) => {
  // Adds Impression to queue
  impressionManager.trackImpression(impressionData.impression);
};

module.exports = {
  logImpression,
};