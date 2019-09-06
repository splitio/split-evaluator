const EVENT_TYPE_REGEX = /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/;

const validateEventType = (maybeEventType) => {
  if (maybeEventType == undefined) { // eslint-disable-line eqeqeq
    return {
      valid: false,
      error: 'you passed a null or undefined event-type, event-type must be a non-empty string.',
    };
  }

  if (maybeEventType.length === 0) {
    return {
      valid: false,
      error: 'you passed an empty event-type, event-type must be a non-empty string.',
    };
  }

  if (!EVENT_TYPE_REGEX.test(maybeEventType)) {
    return {
      valid: false,
      error: `you passed "${maybeEventType}", event-type must adhere to the regular expression /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/g. This means an event_type must be alphanumeric, cannot be more than 80 characters long, and can only include a dash, underscore, period, or colon as separators of alphanumeric characters.`,
    };
  }

  return {
    valid: true,
    value: maybeEventType,
  };
};

module.exports = validateEventType;