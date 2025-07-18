const { isObject, isString } = require('../lang');
const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');

const allowedTypes = ['boolean', 'string', 'number'];

function validatePropertiesObject(obj) {
  if (!isObject(obj)) return false;
  return Object.values(obj).every(v => allowedTypes.includes(typeof v));
}

const validateOptionsOrProperties = (maybeInput) => {
  // eslint-disable-next-line eqeqeq
  if (maybeInput == undefined) return okWrapper(null);

  let input;
  try {
    input = isString(maybeInput) ? JSON.parse(maybeInput) : maybeInput;
    if (!isObject(input)) {
      return errorWrapper('Input must be a plain object.');
    }

    if (input.properties !== undefined) {
      if (!validatePropertiesObject(input.properties)) {
        return errorWrapper('options.properties must only contain boolean, string, or number values.');
      }
      return okWrapper(input);
    }

    if (validatePropertiesObject(input)) {
      return okWrapper(input);
    }

    return errorWrapper('Input must be a plain object.');
  } catch (e) {
    return errorWrapper('Input must be a plain object.');
  }
};

module.exports = validateOptionsOrProperties;