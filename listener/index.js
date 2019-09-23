const ImpressionManager = require('./manager');

const impressionManager = new ImpressionManager();
impressionManager.start();

/**
 * logImpression  impresion listener handler
 * @param {Object} impressionData 
 */
const logImpression = (impressionData) => {
  // Adds Impression to queue
  impressionManager.trackImpression(impressionData.impression);
};

module.exports = logImpression;