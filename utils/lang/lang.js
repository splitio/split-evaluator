/**
 * Validates if a value is an object.
 */
export function isObject(obj) {
  return obj && typeof obj === 'object' && obj.constructor === Object;
}

module.exports = {
  isObject,
};