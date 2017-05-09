'use strict';

/**
 * Given a pair of values, make the processing to create the SplitKey value.
 */
const parseKey = (matchingKey, bucketingKey) => {
  if (!bucketingKey) {
    return matchingKey;
  }

  return {
    matchingKey,
    bucketingKey
  };
};

module.exports = {
  parseKey
};
