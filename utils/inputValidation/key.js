const lang = require('../lang/lang');

const KEY_MAX_LENGTH = 250;

const validateKeyValue = (maybeKey, type) => {
  if (maybeKey == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: false,
      error: `you passed a null or undefined ${type}, ${type} must be a non-empty string.`,
    };
  } else if (lang.isFinite(maybeKey) || lang.isString(maybeKey)) {
    if (lang.isFinite(maybeKey)) {
      console.log(`${type} "${maybeKey}" is not of type string, converting.`);
      return {
        valid: true,
        value: toString(maybeKey),
      };
    }
    // It's a string, start by trimming the value.
    maybeKey = maybeKey.trim();

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
    } else if(maybeKey.length > KEY_MAX_LENGTH) {
      return {
        valid: false,
        error: `${type} too long, ${type} must be 250 characters or less.`,
      };
    }
  } else {
    return {
      valid: false,
      error: `you passed an invalid ${type} type, ${type} must be a non-empty string.`,
    };
  }
};

module.exports = {
  validateKeyValue,
};