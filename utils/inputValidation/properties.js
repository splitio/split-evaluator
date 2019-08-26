const lang = require('../lang/lang');

const validateProperties = (maybeProperties) => {
  const error = {
    valid: false,
    error: 'properties must be a plain object.',
  };
  // eslint-disable-next-line eqeqeq
  if (maybeProperties == undefined) {
    return {
      valid: true,
      value: null,
    };
  }
  try {
    const attributes = JSON.parse(maybeProperties);
    return (lang.isObject(attributes)) ? {
      valid: true,
      value: attributes,
    } : error;
  } catch (e) {
    return error;
  }
};

module.exports = validateProperties;