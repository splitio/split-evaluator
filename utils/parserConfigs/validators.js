const throwError = (msg) => {
  console.log(msg);
  throw new Error(msg);
};

const validUrl = (name) => {
  const url = process.env[name];
  if (/^((https?:\/\/)|(www.))(?:([a-zA-Z]+)(\.([a-zA-Z]+))*|(\d+\.\d+.\d+.\d+))(:\d{1,5})?(\/.*)?$/.test(url)) {
    return url;
  }
  throwError(`you passed an invalid url for ${name}. Received "${url}".`);
};

const isUndefined = (name) => {
  const input = process.env[name];
  // eslint-disable-next-line eqeqeq
  if (input == undefined) throwError(`you passed a null or undefined ${name}, ${name} must be a non-empty string.`);
  return input;
};

const isEmpty = (name) => {
  const trimmed = process.env[name].trim();
  if (trimmed.length === 0) throwError(`you passed an empty ${name}, ${name} must be a non-empty string.`);
  return trimmed;
};

const nullOrEmpty = (name) => {
  isUndefined(name);
  return isEmpty(name);
};

const parseNumber = (name) => {
  const input = process.env[name];

  // eslint-disable-next-line eqeqeq
  if (input == undefined) return null;

  const trimmed = isEmpty(name);
  const inputNumber = Number(trimmed);
  if (isNaN(inputNumber)) throwError(`you passed an invalid ${name}, ${name} must be a valid number.`);
  return inputNumber;
};

const validLogLevel = (name) => {
  const input = process.env[name];

  // eslint-disable-next-line eqeqeq
  if (input == undefined) return null;

  const logLevel = isEmpty(name).toUpperCase();
  const validLevels = ['DEBUG', 'INFO', 'WARN', 'ERROR', 'NONE'];
  if (validLevels.includes(logLevel)) return logLevel;
  throwError(`you passed ${logLevel} is an invalid log level, ${name} accepts NONE|DEBUG|INFO|WARN|ERROR`);
};

module.exports = {
  validUrl,
  validLogLevel,
  nullOrEmpty,
  parseNumber,
};