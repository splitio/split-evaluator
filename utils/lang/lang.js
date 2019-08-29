/**
 * Checks if a given value is a finite number.
 */
const isFinite = (val) => {
  if (typeof val === 'number') return Number.isFinite(val);
  if (val instanceof Number) return Number.isFinite(val.valueOf());

  return false;
};

/**
 * Checks if a given value is a string.
 */
const isString = (val) => typeof val === 'string' || val instanceof String;

/**
 * Validates if a value is an object.
 */
const isObject = (obj) => obj && typeof obj === 'object' && obj.constructor === Object;

/**
 * Removes duplicate items on an array of strings.
 */
const uniq = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);

module.exports = {
  isFinite,
  isObject,
  isString,
  uniq,
};
