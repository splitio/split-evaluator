const { isObject } = require('../lang');
const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');

const validateAttributes = (maybeAttributes) => {
  // eslint-disable-next-line eqeqeq
  if (maybeAttributes == undefined) {
    return okWrapper(null);
  }
  try {
    const attributes = JSON.parse(maybeAttributes);
    return (isObject(attributes)) ? okWrapper(attributes) : errorWrapper('attributes must be a plain object.');
  } catch (e) {
    return errorWrapper('attributes must be a plain object.');
  }
};

module.exports = validateAttributes;