const CAPITAL_LETTERS_REGEX = /[A-Z]/;

const validateTrafficType = (maybeTT) => {
  if (maybeTT == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: false,
      error: 'you passed a null or undefined traffic-type, traffic-type must be a non-empty string.',
    };
  }

  if (maybeTT.length === 0) {
    return {
      valid: false,
      error: 'you passed an empty traffic-type, traffic-type must be a non-empty string.',
    };
  }

  if (CAPITAL_LETTERS_REGEX.test(maybeTT)) {
    maybeTT = maybeTT.toLowerCase();
  }

  return {
    valid: true,
    value: maybeTT,
  };
};

module.exports = validateTrafficType;