const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const EMPTY_FLAG_SET = 'you passed an empty flag-set, flag-set must be a non-empty string.';
const EMPTY_FLAG_SETS = 'you passed an empty flag-sets, flag-sets must be a non-empty array.';
const NULL_FLAG_SET = 'you passed a null or undefined flag-set, flag-set must be a non-empty string.';
const NULL_FLAG_SETS = 'you passed a null or undefined flag-sets, flag-sets must be a non-empty array.';
const MAYBE_FLAG_SETS = 'you passed an invalid flag-set, use /get-treatments-by-sets endpoint to evaluate an array of flag-sets.';

module.exports = {
  TRIMMABLE_SPACES_REGEX,
  EMPTY_FLAG_SET,
  EMPTY_FLAG_SETS,
  NULL_FLAG_SET,
  NULL_FLAG_SETS,
  MAYBE_FLAG_SETS,
};