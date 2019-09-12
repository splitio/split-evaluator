const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const validateSplit = (maybeSplit) => {
  // eslint-disable-next-line eqeqeq
  if (maybeSplit == undefined) return errorWrapper('you passed a null or undefined split-name, split-name must be a non-empty string.');

  if (TRIMMABLE_SPACES_REGEX.test(maybeSplit)) {
    console.log(`split-name "${maybeSplit}" has extra whitespace, trimming.`);
    maybeSplit = maybeSplit.trim();
  }

  return maybeSplit.length > 0 ? okWrapper(maybeSplit) : errorWrapper('you passed an empty split-name, split-name must be a non-empty string.');
};

module.exports = validateSplit;