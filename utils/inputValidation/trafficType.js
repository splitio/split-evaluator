const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const { isString } = require('../lang');

const CAPITAL_LETTERS_REGEX = /[A-Z]/;

const validateTrafficType = (maybeTT) => {
  // eslint-disable-next-line eqeqeq
  if (maybeTT == undefined) return errorWrapper('you passed a null or undefined traffic-type, traffic-type must be a non-empty string.');

  if (isString(maybeTT)) {
    maybeTT = maybeTT.trim();
    if (maybeTT.length === 0) return errorWrapper('you passed an empty traffic-type, traffic-type must be a non-empty string.');
  
    if (CAPITAL_LETTERS_REGEX.test(maybeTT)) {
      maybeTT = maybeTT.toLowerCase();
    }
  
    return okWrapper(maybeTT);
  }

  return errorWrapper('you passed an invalid traffic-type, traffic-type must be a non-empty string.');
};

module.exports = validateTrafficType;