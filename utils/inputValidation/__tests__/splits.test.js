const splitsValidator = require('../splits');

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