const { isString, isFinite } = require('../lang');

const KEY_MAX_LENGTH = 250;

const validateKeyValue = (maybeKey, type) => {
  if (maybeKey == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: false,
      error: `you passed a null or undefined ${type}, ${type} must be a non-empty string.`,
    };
  }
  
  if (isString(maybeKey)) {
    // It's a string, start by trimming the value.
    maybeKey = maybeKey.trim();
  } else {
    if (isFinite(maybeKey)) {
      maybeKey = maybeKey.toString();
    } else {
      return {
        valid: false,
        error: 'you passed an invalid key, key must be a non-empty string.',
      };
    }
  }

  // It's aaaaaall good.
  if (maybeKey.length > 0 && maybeKey.length <= KEY_MAX_LENGTH) return {
    valid: true,
    value: maybeKey,
  };

  if (maybeKey.length === 0) {
    return {
      valid: false,
      error: `you passed an empty string, ${type} must be a non-empty string.`,
    };
  }

  return {
    valid: false,
    error: `${type} too long, ${type} must be 250 characters or less.`,
  };
};

module.exports = validateKeyValue;