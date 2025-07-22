const TRIMMABLE_SPACES_REGEX = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/;

const EMPTY_FLAG_SETS = 'you passed an empty flag-sets, flag-sets must be a non-empty array.';
const NULL_FLAG_SETS = 'you passed a null or undefined flag-sets, flag-sets must be a non-empty array.';

const PROPERTIES_WARNING = 'Warning: properties must be a plain object with only boolean, string, number or null values. Properties will be ignored.';
const PROPERTIES_KEY_LIMIT_WARNING = 'Warning: properties object must not have more than 15 keys. Properties will be ignored.';

module.exports = {
  TRIMMABLE_SPACES_REGEX,
  EMPTY_FLAG_SETS,
  NULL_FLAG_SETS,
  PROPERTIES_WARNING,
  PROPERTIES_KEY_LIMIT_WARNING,
};