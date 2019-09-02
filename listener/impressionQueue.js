const config = require('config');
const IMPRESSIONS_PER_POST = config.get('impressionsPerPost') ? config.get('impressionsPerPost') : 500;

const Impressions = [];

/**
 * addImpression  adds one impression into queue
 * @param {Object} impression 
 */
const addImpression = (impression) => {
  Impressions.push(impression);
};

/**
 * getSize  returns the current size of the queue
 */
const getSize = () => Impressions.length;

/**
 * getImpressionsToPost generates the impressions object to be sent
 */
const getImpressionsToPost = () => {
  const impressionsToPost = [];
  const splice = Impressions.splice(0, IMPRESSIONS_PER_POST);
  const groupedImpressions = new Map();

  splice.forEach(impression => {
    const keyImpressions = {
      keyName: impression.keyName,
      treatment: impression.treatment,
      time: impression.time,
      changeNumber: impression.changeNumber,
      label: impression.label,
    };
    if (!groupedImpressions.has(impression.feature)) {
      groupedImpressions.set(impression.feature, [keyImpressions]);
    } else {
      const currentImpressions = groupedImpressions.get(impression.feature);
      groupedImpressions.set(impression.feature, currentImpressions.concat(keyImpressions));
    }
  });
  
  groupedImpressions.forEach((value, key) => {
    const impressionToPost = {
      testName: key,
      keyImpressions: value,
    };
    impressionsToPost.push(impressionToPost);
  });
  return impressionsToPost;
};

module.exports = {
  addImpression,
  getImpressionsToPost,
  getSize,
};