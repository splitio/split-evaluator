const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const { NULL_FLAG_SET, EMPTY_FLAG_SET, TRIMMABLE_SPACES_REGEX } = require('../constants');

const validateFlagSet = (maybeFlagSet) => {
  // eslint-disable-next-line
  if (maybeFlagSet == undefined) return errorWrapper(NULL_FLAG_SET);

  if (TRIMMABLE_SPACES_REGEX.test(maybeFlagSet)) {
    console.log(`flag-sets "${maybeFlagSet}" has extra whitespace, trimming.`);
    maybeFlagSet = maybeFlagSet.trim();
  }
  if (maybeFlagSet.length === 0) return errorWrapper(EMPTY_FLAG_SET);

  return okWrapper(maybeFlagSet);
};

module.exports = validateFlagSet;