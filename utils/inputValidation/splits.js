const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const lang = require('../lang');
const splitValidator = require('./split');

const validateSplits = (maybeSplits) => {
  // eslint-disable-next-line eqeqeq
  if (maybeSplits == undefined) return errorWrapper('you passed a null or undefined split-names, split-names must be a non-empty array.');

  maybeSplits = maybeSplits.split(',');

  if (maybeSplits.length > 0) {
    let validatedArray = [];
    // Remove invalid values
    maybeSplits.forEach(maybeSplit => {
      const splitValidation = splitValidator(maybeSplit);
      if (splitValidation.valid) validatedArray.push(splitValidation.value);
    });

    // Strip off duplicated values if we have valid split names then return
    if (validatedArray.length) return okWrapper(lang.uniq(validatedArray));
  }

  return errorWrapper('split-names must be a non-empty array.');
};

module.exports = validateSplits;