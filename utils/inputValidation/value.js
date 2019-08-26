const validateValue = (maybeValue) => {
  if (maybeValue == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: true,
      value: null,
    };
  }

  if (maybeValue.length === 0 || maybeValue.trim().length === 0) {
    return {
      valid: false,
      error: 'value must be null or number.',
    };
  }

  if (isNaN(Number(maybeValue))) {
    return {
      valid: false,
      error: 'value must be null or number.',
    };
  }

  return {
    valid: true,
    value: Number(maybeValue),
  };
};

module.exports = validateValue;