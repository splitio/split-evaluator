const { isObject, isString } = require('../lang');
const okWrapper = require('./wrapper/ok');
const { PROPERTIES_WARNING, PROPERTIES_KEY_LIMIT_WARNING } = require('../constants');

function validateProperties(maybeProperties, enforceKeyLimit = false) {
  // @TODO make the validation more specific
  // eslint-disable-next-line eqeqeq
  if (maybeProperties == undefined) return okWrapper(null);
  let properties;
  try {
    properties = isString(maybeProperties) ? JSON.parse(maybeProperties) : maybeProperties;
    if (!isObject(properties)) {
      console.log(PROPERTIES_WARNING);
      properties = null;
    }
    const keys = Object.keys(properties);
    if (enforceKeyLimit && keys.length > 15) {
      console.log(PROPERTIES_KEY_LIMIT_WARNING);
      properties = null;
    }
    return okWrapper(properties);
  } catch (e) {
    console.log(PROPERTIES_WARNING);
    return okWrapper(null);
  }
}

module.exports = {
  validateProperties,
};