const splitValidator = require('../split');

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
