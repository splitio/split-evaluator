const validateEvaluationOptions = require('../evaluationOptions');

describe('validateEvaluationOptions', () => {
  test('should be valid when options is undefined', () => {
    const result = validateEvaluationOptions();
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', null);
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when options is a plain object with allowed types', () => {
    const options = { properties: { bool: true, str: 'test', num: 42 }};
    const result = validateEvaluationOptions(options);
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', options);
    expect(result).not.toHaveProperty('error');
  });

  test('should be valid when options is a stringified object with allowed types', () => {
    const options = { bool: false, str: 'abc', num: 0 };
    const result = validateEvaluationOptions(JSON.stringify(options));
    expect(result).toHaveProperty('valid', true);
    expect(result).toHaveProperty('value', options);
    expect(result).not.toHaveProperty('error');
  });

  test('should return error when options is not an object', () => {
    const result = validateEvaluationOptions('not an object');
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error');
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when options contains disallowed types', () => {
    const options = { properties: { arr: [], obj: {}, func: () => {}, bool: true }};
    const result = validateEvaluationOptions(options);
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error');
    expect(result).not.toHaveProperty('value');
  });

  test('should return error when options is a stringified object with disallowed types', () => {
    const options = { properties: { arr: [], obj: {}, bool: true }};
    const result = validateEvaluationOptions(JSON.stringify(options));
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error');
    expect(result).not.toHaveProperty('value');
  }); 

  test('should return error when options is a stringified object with disallowed types', () => {
    const options = { properties: { arr: [], obj: {}, bool: true }};
    const result = validateEvaluationOptions(JSON.stringify(options));
    expect(result).toHaveProperty('valid', false);
    expect(result).toHaveProperty('error');
    expect(result).not.toHaveProperty('value');
  });
});