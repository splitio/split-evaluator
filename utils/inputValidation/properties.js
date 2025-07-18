const { isObject, isString } = require('../lang');
const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');

function validateProperties(maybeProperties) {
  // @TODO make the validation more specific
  // eslint-disable-next-line eqeqeq
  if (maybeProperties == undefined) return okWrapper(null);
  let properties;
  try {
    properties = isString(maybeProperties) ? JSON.parse(maybeProperties) : maybeProperties;
    if (!isObject(properties)) {
      return errorWrapper('properties must be a plain object with only boolean, string, number or null values.');
    }
    return okWrapper(properties);
  } catch (e) {
    return errorWrapper('properties must be a plain object with only boolean, string, number or null values.');
  }
}

function validateEvaluationOptions(maybeOptions) {
  // eslint-disable-next-line eqeqeq
  if (maybeOptions == undefined) return okWrapper(null);
  let options;
  try {
    options = isString(maybeOptions) ? JSON.parse(maybeOptions) : maybeOptions;
    if (!isObject(options)) {
      return errorWrapper('options must be a plain object.');
    }
    if ('properties' in options) {
      return validateProperties(options.properties);
    }
    return okWrapper(options);
  } catch (e) {
    return errorWrapper('options must be a plain object.');
  }
}

module.exports = {
  validateProperties,
  validateEvaluationOptions,
};