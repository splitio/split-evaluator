/**
 * Validates if a value is an object.
 */
const isObject = (obj) => obj && typeof obj === 'object' && obj.constructor === Object;

/**
 * Removes duplicate items on an array of strings.
 */
const uniq = (arr) => arr.filter((v, i, a) => a.indexOf(v) === i);

module.exports = {
  isObject,
  uniq,
};
