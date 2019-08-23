const lang = require('../lang/lang');
const splitValidator = require('./split');

const validateSplits = (maybeSplits) => {
  if (maybeSplits == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: false,
      error: 'you passed a null or undefined split-names, split-names must be a non-empty array.',
    };
  }

  maybeSplits = maybeSplits.split(',');

  if (maybeSplits.length > 0) {
    let validatedArray = [];
    // Remove invalid values
    maybeSplits.forEach(maybeSplit => {
      const splitValidation = splitValidator(maybeSplit);
      if (splitValidation.valid) validatedArray.push(splitValidation.value);
    });

    // Strip off duplicated values if we have valid split names then return
    if (validatedArray.length) return {
      valid: true,
      value: lang.uniq(validatedArray),
    };
  }

  return {
    valid: false,
    error: 'split-names must be a non-empty array.',
  };
};

module.exports = validateSplits;