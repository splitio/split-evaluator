'use strict';

const packageJson = require('./package.json');

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

const getVersion = () => {
  return packageJson && packageJson.version;
};

module.exports = {
  parseKey,
  getVersion
};