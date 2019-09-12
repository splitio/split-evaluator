const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const lang = require('../lang');

const validateProperties = (maybeProperties) => {
  // eslint-disable-next-line eqeqeq
  if (maybeProperties == undefined) return okWrapper(null);

  try {
    const properties = JSON.parse(maybeProperties);
    return (lang.isObject(properties)) ? okWrapper(properties) : errorWrapper('properties must be a plain object.');
  } catch (e) {
    return errorWrapper('properties must be a plain object.');
  }
};

module.exports = validateProperties;