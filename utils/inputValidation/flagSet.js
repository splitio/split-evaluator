const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const validateFlagSet = (maybeFlagSet) => {
  // eslint-disable-next-line
  if (maybeFlagSet == undefined) return okWrapper(null);

  if (TRIMMABLE_SPACES_REGEX.test(maybeFlagSet)) {
    console.log(`set-names "${maybeFlagSet}" has extra whitespace, trimming.`);
    maybeFlagSet = maybeFlagSet.trim();
  }
  if (maybeFlagSet.length === 0) return errorWrapper('you passed an empty set-names, set-names must be a non-empty string.');

  return okWrapper(maybeFlagSet.split(','));
};

module.exports = validateFlagSet;