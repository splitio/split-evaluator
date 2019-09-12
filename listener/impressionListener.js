const config = require('config');
const IMPRESSIONS_PER_POST = config.get('impressionsPerPost') ? config.get('impressionsPerPost') : 500;
const { addImpression, getSize } = require('./impressionQueue');
const context = require('./context');

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
  addImpression(impressionToAdd);

  // Flushes only if is greater than equal IMPRESSIONS_PER_POST
  if (getSize() >= IMPRESSIONS_PER_POST) {
    context.flushAndResetTime();
  }
};

module.exports = logImpression;