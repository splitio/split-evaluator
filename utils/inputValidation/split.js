const logger = require('../../config/winston');

const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const validateSplit = (maybeSplit) => {
  if (maybeSplit == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: false,
      error: 'you passed a null or undefined split-name, split-name must be a non-empty string.',
    };
  }

  if (TRIMMABLE_SPACES_REGEX.test(maybeSplit)) {
    logger.warn(`split-name "${maybeSplit}" has extra whitespace, trimming.`);
    maybeSplit = maybeSplit.trim();
  }

  return maybeSplit.length > 0 ?
    {
      valid: true,
      value: maybeSplit,
    } : {
      valid: false,
      error: 'you passed an empty split-name, split-name must be a non-empty string.',
    };
};

module.exports = validateSplit;