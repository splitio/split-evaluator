const throwError = (msg) => {
  console.log(msg);
  throw new Error(msg);
};

const validUrl = (name) => {
  const url = process.env[name];
  if (/^(https?:\/\/)?((([\da-zA-Z-_]+)(\.([\da-zA-Z-_]+))*)|(\d+\.\d+.\d+.\d+))(:\d{1,5})?(\/.*)?$/.test(url)) {
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

const isString = (value) => {
  return (typeof value === 'string' || value instanceof String);
};

const validEnvironment = (environment) => {
  if(!environment['API_KEY']) throwError('API_KEY value not present in one or more environment config');
  if(!environment['AUTH_TOKEN']) throwError('AUTH_TOKEN value not present in one or more environment config');
};

const validEnvironmentConfig = (environmentParam) => {
  nullOrEmpty(environmentParam);
  const input = process.env[environmentParam];
  if (!isString(input))
    throwError(`you passed an invalid ${environmentParam}, ${environmentParam} must be a string`);
  const environmentConfig = JSON.parse(process.env[environmentParam]);
  if(!Array.isArray(environmentConfig))
    throwError(`you passed an invalid ${environmentParam}, ${environmentParam} must be a list of environments.`);
  return environmentConfig;
};

const validGlobalConfig = (globalParam) => {
  nullOrEmpty(globalParam);
  const input = process.env[globalParam];
  if (!isString(input))
    throwError(`you passed an invalid ${globalParam}, ${globalParam} must be a string`);
  try {
    const globalConfig = JSON.parse(process.env[globalParam]);
    return globalConfig;
  } catch (err) {
    throwError('Invalid globalConfig JSON');
  }
};

const validFlagSets = (maybeFlagSets) => {
  if (!maybeFlagSets) return;
  if (!isString(maybeFlagSets)) {
    throwError('you passed an invalid flag set, flag sets must be comma separated a string list');
    return;
  }
  return [{type: 'bySet', values: maybeFlagSets.split(',')}];
};

module.exports = {
  throwError,
  validUrl,
  validLogLevel,
  nullOrEmpty,
  parseNumber,
  isString,
  validEnvironment,
  validEnvironmentConfig,
  validGlobalConfig,
  validFlagSets,
};