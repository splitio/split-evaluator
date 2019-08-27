const eventTypeValidator = require('../eventType');

describe('eventType validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined event-type, event-type must be a non-empty string.';

    const result = eventTypeValidator();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty event-type, event-type must be a non-empty string.';

    const result = eventTypeValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on not valid event-type', async () => {
    const expected = 'you passed "@asdasda", event-type must adhere to the regular expression /^[a-zA-Z0-9][-_.:a-zA-Z0-9]{0,79}$/g. This means an event_type must be alphanumeric, cannot be more than 80 characters long, and can only include a dash, underscore, period, or colon as separators of alphanumeric characters.';

    const result = eventTypeValidator('@asdasda');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = eventTypeValidator('my-event-type');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-event-type');
    expect(result).not.toHaveProperty('error');
  });
});
