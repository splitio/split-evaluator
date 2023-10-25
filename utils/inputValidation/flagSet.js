const { NULL_FLAG_SETS, EMPTY_FLAG_SETS } = require('../constants');
const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const validateFlagSet = (maybeFlagSet) => {
  // eslint-disable-next-line
  if (maybeFlagSet == undefined) return errorWrapper(NULL_FLAG_SETS);

  if (TRIMMABLE_SPACES_REGEX.test(maybeFlagSet)) {
    console.log(`flag-sets "${maybeFlagSet}" has extra whitespace, trimming.`);
    maybeFlagSet = maybeFlagSet.trim();
  }
  if (maybeFlagSet.length === 0) return errorWrapper(EMPTY_FLAG_SETS);

  return okWrapper(maybeFlagSet.split(','));
};

module.exports = validateFlagSet;