const reduce = require('lodash/reduce');

/**
 * filterSplitsByTT Reduces a collection of split views to a list of names of the splits
 * corresponding to the given traffic type.
 * @param object splitViews 
 * @param string trafficType 
 */
const filterSplitsByTT = (splitViews, trafficType) => {
  return reduce(splitViews, (acc, view) => {
    if (view.trafficType === trafficType) {
      acc.push(view.name);
    }
    return acc;
  }, []);
};

module.exports = {
  filterSplitsByTT,
};
