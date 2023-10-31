const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const lang = require('../lang');
const validateFlagSet = require('./flagSet');
const { EMPTY_FLAG_SETS, NULL_FLAG_SETS } = require('../constants');

const validateFlagSets = (maybeFlagSets) => {
  // eslint-disable-next-line eqeqeq
  if (maybeFlagSets == undefined) return errorWrapper(NULL_FLAG_SETS);

  maybeFlagSets = maybeFlagSets.split(',');

  if (maybeFlagSets.length > 0) {
    let validatedArray = [];
    // Remove invalid values
    maybeFlagSets.forEach(maybeFlagSet => {
      const flagSetValidation = validateFlagSet(maybeFlagSet);
      if (flagSetValidation.valid) validatedArray.push(flagSetValidation.value);
    });

    // Strip off duplicated values if we have valid flag sets then return
    if (validatedArray.length) return okWrapper(lang.uniq(validatedArray));
  }

  return errorWrapper(EMPTY_FLAG_SETS);
};

module.exports = validateFlagSets;