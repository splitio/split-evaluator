const { isObject, isString } = require('../lang');
const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');

const validateAttributes = (maybeAttributes) => {
  // eslint-disable-next-line eqeqeq
  if (maybeAttributes == undefined) {
    return okWrapper(null);
  }
  try {
    let attributes;
    if (isString(maybeAttributes)) { // If it came as a query param, parse it from string
      maybeAttributes = JSON.parse(maybeAttributes);
    } 
    if (isObject(maybeAttributes)) { // Parsed query or coming from a JSON payload, check if it's an object.
      attributes = maybeAttributes;
    }
    return (isObject(attributes)) ? okWrapper(attributes) : errorWrapper('attributes must be a plain object.');
  } catch (e) {
    return errorWrapper('attributes must be a plain object.');
  }
};

module.exports = validateAttributes;