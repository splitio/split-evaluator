const splitsValidator = require('../splits');

describe('splits validator', () => {
  test('should return error on undefined', done => {
    const expected = 'you passed a null or undefined split-names, split-names must be a non-empty array.';

    const result = splitsValidator();

    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on empty', done => {
    const expected = 'split-names must be a non-empty array.';

    const result = splitsValidator('');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should return error on trim', done => {
    const expected = 'split-names must be a non-empty array.';

    const result = splitsValidator('  ');
    
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error', expected);
    expect(result).not.toHaveProperty('value');
    done();
  });

  test('should be valid when ok', done => {
    const result = splitsValidator('my-split');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', ['my-split']);
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid when ok and should trim', done => {
    const result = splitsValidator(' my-split     ');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', ['my-split']);
    expect(result).not.toHaveProperty('error');
    done();
  });

  test('should be valid on multiple inputs and repeated splits', done => {
    const result = splitsValidator(' my-split     ,my-split2,    my-split, test');
    
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', ['my-split','my-split2','test']);
    expect(result).not.toHaveProperty('error');
    done();
  });
});