const { isObject } = require('../lang');

const validateAttributes = (maybeAttributes) => {
  const error = {
    valid: false,
    error: 'attributes must be a plain object.',
  };
  // eslint-disable-next-line eqeqeq
  if (maybeAttributes == undefined) {
    return {
      valid: true,
      value: null,
    };
  }
  try {
    const attributes = JSON.parse(maybeAttributes);
    return (isObject(attributes)) ? {
      valid: true,
      value: attributes,
    } : error;
  } catch (e) {
    return error;
  }
};

module.exports = validateAttributes;