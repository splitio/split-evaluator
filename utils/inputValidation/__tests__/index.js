const keyValidator = require('../key');
const splitValidator = require('../split');
const splitsValidator = require('../splits');
const attributesValidator = require('../attributes');
const trafficTypeValidator = require('../trafficType');
const eventTypeValidator = require('../eventType');
const valueValidator = require('../value');
const propertiesValidator = require('../properties');

describe('key validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined key, key must be a non-empty string.';

    const result = keyValidator(null, 'key');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty string, key must be a non-empty string.';

    const result = keyValidator('', 'key');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on trim', async () => {
    const expected = 'you passed an empty string, key must be a non-empty string.';

    const result = keyValidator('   ', 'key');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when key is too long', async () => {
    let keyInput = '';
    for (let i = 0; i<=250; i++) {
      keyInput += 'a';
    }
    const expected = 'key too long, key must be 250 characters or less.';

    const result = keyValidator(keyInput, 'key');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = keyValidator('key', 'key');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'key');
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when ok and should trim', async () => {
    const result = keyValidator('   key ', 'key');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'key');
    expect(result).not.toHaveProperty('error');
  });
});

describe('split validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined split-name, split-name must be a non-empty string.';

    const result = splitValidator();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty split-name, split-name must be a non-empty string.';

    const result = splitValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on trim', async () => {
    const expected = 'you passed an empty split-name, split-name must be a non-empty string.';

    const result = splitValidator('  ');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = splitValidator('my-split');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-split');
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when ok and should trim', async () => {
    const result = splitValidator(' my-split     ');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-split');
    expect(result).not.toHaveProperty('error');
  });
});

describe('attributes validator', () => {
  test('should return error on invalid attributes', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('test');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid attributes 2', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('[]');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid attributes 3', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator('true');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when attributes is an object', async () => {
    const result = attributesValidator('{"my-attr1":true}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-attr1': true,
    });
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when attributes is empty object', async () => {
    const result = attributesValidator('{}');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when attributes is null', async () => {
    const result = attributesValidator();
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
  });
});

describe('splits validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined split-names, split-names must be a non-empty array.';

    const result = splitsValidator();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'split-names must be a non-empty array.';

    const result = splitsValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on trim', async () => {
    const expected = 'split-names must be a non-empty array.';

    const result = splitsValidator('  ');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = splitsValidator('my-split');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', ['my-split']);
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when ok and should trim', async () => {
    const result = splitsValidator(' my-split     ');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', ['my-split']);
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid on multiple inputs and repeated splits', async () => {
    const result = splitsValidator(' my-split     ,my-split2,    my-split, test');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', ['my-split','my-split2','test']);
    expect(result).not.toHaveProperty('error');
  });
});

describe('trafficType validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined traffic-type, traffic-type must be a non-empty string.';

    const result = trafficTypeValidator();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty traffic-type, traffic-type must be a non-empty string.';

    const result = trafficTypeValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = trafficTypeValidator('my-traffic-type');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-traffic-type');
    expect(result).not.toHaveProperty('error');
  });
});

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

describe('value validator', () => {
  test('should return error on empty', async () => {
    const expected = 'value must be null or number.';

    const result = valueValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty trim', async () => {
    const expected = 'value must be null or number.';

    const result = valueValidator('  ');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return valid on undefined', async () => {
    const result = valueValidator();

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
  });

  test('should return valid on number', async () => {
    const result = valueValidator('1234');

    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 1234);
    expect(result).not.toHaveProperty('error');
  });
});

describe('properties validator', () => {
  test('should return error on invalid properties', async () => {
    const expected = 'properties must be a plain object.';

    const result = propertiesValidator('test');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid properties 2', async () => {
    const expected = 'properties must be a plain object.';

    const result = propertiesValidator('[]');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid properties 3', async () => {
    const expected = 'properties must be a plain object.';

    const result = propertiesValidator('true');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when properties is an object', async () => {
    const result = propertiesValidator('{"my-prop":true}');
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-prop': true,
    });
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when properties is empty object', async () => {
    const result = propertiesValidator('{}');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when properties is null', async () => {
    const result = propertiesValidator();
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
  });
});
