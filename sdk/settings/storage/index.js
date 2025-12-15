const { STORAGE_MEMORY } = require('@splitsoftware/splitio-commons/cjs/utils/constants');

function validateStorage(settings) {
  let {
    log,
    storage: {
      type,
      prefix,
    } = { type: STORAGE_MEMORY },
  } = settings;

  // If passing an invalid storage type, log an error
  if (type !== STORAGE_MEMORY) log.error(`The provided '${type}' storage type is invalid. Fallback into default MEMORY storage.`);
  return {
    type: STORAGE_MEMORY,
    prefix,
  };
}

module.exports = {
  validateStorage,
};
