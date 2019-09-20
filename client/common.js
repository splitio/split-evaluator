/**
 * filterSplitsByTT Reduces a collection of split views to a list of names of the splits
 * corresponding to the given traffic type.
 * @param object splitViews 
 * @param string trafficType 
 */
const filterSplitsByTT = (splitViews, trafficType) => splitViews.reduce((acc, view) => {
  if (view.trafficType === trafficType) {
    acc.push(view.name);
  }
  return acc;
}, []);

/**
 * parseKey  Given a pair of values, make the processing to create the SplitKey value.
 * @param string matchingKey 
 * @param string bucketingKey 
 */
const parseKey = (matchingKey, bucketingKey) => !bucketingKey ? matchingKey : {
  matchingKey,
  bucketingKey,
};

module.exports = {
  filterSplitsByTT,
  parseKey,
};
