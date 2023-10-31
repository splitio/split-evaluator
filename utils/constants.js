const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const EMPTY_FLAG_SETS = 'you passed an empty flag-sets, flag-sets must be a non-empty array.';
const NULL_FLAG_SETS = 'you passed a null or undefined flag-sets, flag-sets must be a non-empty array.';

module.exports = {
  TRIMMABLE_SPACES_REGEX,
  EMPTY_FLAG_SETS,
  NULL_FLAG_SETS,
};