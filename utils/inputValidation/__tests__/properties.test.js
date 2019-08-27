const propertiesValidator = require('../properties');

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
