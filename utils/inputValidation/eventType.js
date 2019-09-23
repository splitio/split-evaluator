const errorWrapper = require('./wrapper/error');
const okWrapper = require('./wrapper/ok');
const EVENT_TYPE_REGEX = /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/;

const validateEventType = (maybeEventType) => {
  // eslint-disable-next-line eqeqeq
  if (maybeEventType == undefined) return errorWrapper('you passed a null or undefined event-type, event-type must be a non-empty string.');
  if (maybeEventType.length === 0) return errorWrapper('you passed an empty event-type, event-type must be a non-empty string.');
  if (!EVENT_TYPE_REGEX.test(maybeEventType)) return errorWrapper(`you passed "${maybeEventType}", event-type must adhere to the regular expression /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/g. This means an event_type must be alphanumeric, cannot be more than 80 characters long, and can only include a dash, underscore, period, or colon as separators of alphanumeric characters.`);

  return okWrapper(maybeEventType);
};

module.exports = validateEventType;