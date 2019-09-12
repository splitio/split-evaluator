const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const trafficTypeValidator = require('./trafficType');
const keyValidator = require('./key');

const validateKeys = (maybeKeys) => {
  // eslint-disable-next-line eqeqeq
  if (maybeKeys == undefined) return errorWrapper('you passed null or undefined keys, keys must be a non-empty array.');
  try {
    const keys = JSON.parse(maybeKeys);
    if (!Array.isArray(keys)) return errorWrapper('keys must be a valid format.');
    if (keys.length === 0) return errorWrapper('there should be at least one matchingKey-trafficType element.');

    const validKeys = [];

    const trafficTypes = new Set;
    let trafficTypeDuplicated = false;

    const isInvalid = keys.some(key => {
      const trafficTypeValidation = trafficTypeValidator(key.trafficType);
      const matchingKeyValidation = keyValidator(key.matchingKey, 'matchingKey');
      const bucketingKeyValidation = key.bucketingKey !== undefined ? keyValidator(key.bucketingKey, 'bucketingKey') : okWrapper(null);

      if (!trafficTypeValidation.valid || !matchingKeyValidation.valid || !bucketingKeyValidation.valid) return true;

      if (trafficTypes.has(trafficTypeValidation.value)) {
        trafficTypeDuplicated = true;
      }
      trafficTypes.add(trafficTypeValidation.value);
      validKeys.push({
        trafficType: trafficTypeValidation.value,
        matchingKey: matchingKeyValidation.value,
        bucketingKey: bucketingKeyValidation.value,
      });
    });

    if (isInvalid) return errorWrapper('keys is array but there are errors inside of it. keys must be an array with at least one element that contain a valid matchingKey and trafficType. It can also includes bucketingKey.');

    return trafficTypeDuplicated ? errorWrapper('at least one trafficType is duplicated in keys object.') : okWrapper(validKeys);
  } catch (e) {
    return errorWrapper('keys must be a valid format.');
  }
};

module.exports = validateKeys;