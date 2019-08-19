/**
 * Checks if a given value is a string.
 */
const isString = (val) => {
  return typeof val === 'string' || val instanceof String;
};

/**
 * Checks if a given value is a finite number.
 */
const isFinite = (val) => {
  if (typeof val === 'number') return Number.isFinite(val);
  if (val instanceof Number) return Number.isFinite(val.valueOf());

  return false;
};

/**
 * Validates if a value is an object.
 */
export function isObject(obj) {
  return obj && typeof obj === 'object' && obj.constructor === Object;
}

/**
 * Returns an object that was obtained form JSON parsing.
 */
const getObjectFromJSON = (val) => {
  try {
    const obj = JSON.parse(val);
    return obj;
  } catch (error) {
    return null;
  }
};

module.exports = {
  isString,
  isFinite,
  isObject,
  getObjectFromJSON,
};