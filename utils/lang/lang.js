/**
 * Validates if a value is an object.
 */
const isObject = (obj) => obj && typeof obj === 'object' && obj.constructor === Object;

module.exports = {
  isObject,
};