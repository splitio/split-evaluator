const ImpressionManager = require('./manager');

const impressionManager = new ImpressionManager();
impressionManager.start();

/**
 * logImpression  impresion listener handler
 * @param {Object} impressionData 
 */
const logImpression = (impressionData) => {
  const impression = impressionData.impression;
  const impressionToAdd = {
    feature: impression.feature,
    keyName: impression.keyName,
    treatment: impression.treatment,
    time: impression.time,
    changeNumber: impression.changeNumber,
    label: impression.label,
  };

  // Adds Impression to queue
  impressionManager.trackImpression(impressionToAdd);
};

module.exports = logImpression;