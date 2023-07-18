/**
 * filterFeatureFlagsByTT Reduces a collection of featureFlag views to a list of names of the featureFlags
 * corresponding to the given traffic type.
 * @param object featureFlagViews
 * @param string trafficType
 */
const filterFeatureFlagsByTT = (featureFlagViews, trafficType) => featureFlagViews.reduce((acc, view) => {
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
  filterFeatureFlagsByTT,
  parseKey,
};
