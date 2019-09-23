const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const { isString, isFinite } = require('../lang');

const KEY_MAX_LENGTH = 250;

const validateKeyValue = (maybeKey, type) => {
  // eslint-disable-next-line eqeqeq
  if (maybeKey == undefined) return errorWrapper(`you passed a null or undefined ${type}, ${type} must be a non-empty string.`);
  
  if (isString(maybeKey)) {
    // It's a string, start by trimming the value.
    maybeKey = maybeKey.trim();
  } else if (isFinite(maybeKey)) {
    maybeKey = maybeKey.toString();
  } else return errorWrapper('you passed an invalid key, key must be a non-empty string.');

  // It's aaaaaall good.
  if (maybeKey.length > 0 && maybeKey.length <= KEY_MAX_LENGTH)return okWrapper(maybeKey);

  if (maybeKey.length === 0) return errorWrapper(`you passed an empty string, ${type} must be a non-empty string.`);

  return errorWrapper(`${type} too long, ${type} must be 250 characters or less.`);
};

module.exports = validateKeyValue;