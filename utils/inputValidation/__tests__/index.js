const keyValidator = require('../key');
const splitValidator = require('../split');
const attributesValidator = require('../attributes');

describe('key validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined key, key must be a non-empty string.';

    const result = keyValidator.validateKeyValue(null, 'key');

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty string, key must be a non-empty string.';

    const result = keyValidator.validateKeyValue('', 'key');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on trim', async () => {
    const expected = 'you passed an empty string, key must be a non-empty string.';

    const result = keyValidator.validateKeyValue('   ', 'key');
    
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

    const result = keyValidator.validateKeyValue(keyInput, 'key');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = keyValidator.validateKeyValue('key', 'key');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'key');
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when ok and should trim', async () => {
    const result = keyValidator.validateKeyValue('   key ', 'key');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'key');
    expect(result).not.toHaveProperty('error');
  });
});

describe('split validator', () => {
  test('should return error on undefined', async () => {
    const expected = 'you passed a null or undefined split-name, split-name must be a non-empty string.';

    const result = splitValidator.validateSplit();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on empty', async () => {
    const expected = 'you passed an empty split-name, split-name must be a non-empty string.';

    const result = splitValidator.validateSplit('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on trim', async () => {
    const expected = 'you passed an empty split-name, split-name must be a non-empty string.';

    const result = splitValidator.validateSplit('  ');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when ok', async () => {
    const result = splitValidator.validateSplit('my-split');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-split');
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when ok and should trim', async () => {
    const result = splitValidator.validateSplit(' my-split     ');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', 'my-split');
    expect(result).not.toHaveProperty('error');
  });
});

describe('attributes validator', () => {
  test('should return error on invalid attributes', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator.validateAttributes('test');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid attributes 2', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator.validateAttributes('[]');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should return error on invalid attributes 3', async () => {
    const expected = 'attributes must be a plain object.';

    const result = attributesValidator.validateAttributes('true');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
  });

  test('should be valid when attributes is an object', async () => {
    const result = attributesValidator.validateAttributes('{"my-attr1":true}');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {
      'my-attr1': true,
    });
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when attributes is empty object', async () => {
    const result = attributesValidator.validateAttributes('{}');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', {});
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when attributes is null', async () => {
    const result = attributesValidator.validateAttributes();
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
  });
});
