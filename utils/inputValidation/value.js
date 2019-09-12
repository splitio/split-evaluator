const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');

const validateValue = (maybeValue) => {
  // eslint-disable-next-line eqeqeq
  if (maybeValue == undefined) return okWrapper(null);

  if (maybeValue.length === 0 || maybeValue.trim().length === 0) return errorWrapper('value must be null or number.');
  if (isNaN(Number(maybeValue))) return errorWrapper('value must be null or number.');

  return okWrapper(Number(maybeValue));
};

module.exports = validateValue;