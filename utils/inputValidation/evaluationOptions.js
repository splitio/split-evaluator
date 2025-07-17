const { isObject, isString } = require('../lang');
const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');

const validateEvaluationOptions = (maybeOptions) => {
  // eslint-disable-next-line eqeqeq
  if (maybeOptions == undefined) {
    return okWrapper(null);
  }
  try {
    let options;
    if (isString(maybeOptions)) {
      maybeOptions = JSON.parse(maybeOptions);
    }
    if (isObject(maybeOptions)) { 
      options = maybeOptions;
    }
    // If options.properties exists, validate its values
    if (options && isObject(options.properties)) {
      const allowedTypes = ['boolean', 'string', 'number'];
      const invalid = Object.values(options.properties).some(
        v => !allowedTypes.includes(typeof v)
      );
      if (invalid) {
        return errorWrapper('options.properties must only contain boolean, string, or number values.');
      }
    }
    return okWrapper(options);
  } catch (e) {
    return errorWrapper('options must be a plain object and options.properties must only contain boolean, string, or number values.');
  }
};

module.exports = validateEvaluationOptions;